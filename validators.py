import re
import os
from typing import Dict, Any, Optional

try:
    import phonenumbers
    PHONENUMBERS_AVAILABLE = True
except ImportError:
    PHONENUMBERS_AVAILABLE = False

class PhoneValidator:
    def __init__(self, default_region: str = "RU"):
        self.default_region = default_region
    
    def validate(self, phone_number: str) -> Dict[str, Any]:
        """Validate phone number format"""
        if not PHONENUMBERS_AVAILABLE:
            # Basic validation without phonenumbers library
            cleaned = re.sub(r'[^0-9+]', '', phone_number)
            if cleaned.startswith('+') and len(cleaned) >= 10:
                return {'is_valid': True, 'cleaned': cleaned}
            else:
                return {'is_valid': False, 'error': 'Invalid format', 'cleaned': cleaned}
        
        try:
            # Clean the input
            cleaned_number = re.sub(r'[^0-9+]', '', phone_number)
            
            # Parse the phone number
            parsed_number = phonenumbers.parse(cleaned_number, self.default_region)
            
            # Check if the number is valid
            is_valid = phonenumbers.is_valid_number(parsed_number)
            
            return {
                'is_valid': is_valid,
                'parsed': parsed_number,
                'cleaned': cleaned_number
            }
        except Exception as e:
            return {
                'is_valid': False,
                'error': str(e),
                'cleaned': cleaned_number if 'cleaned_number' in locals() else phone_number
            }
    
    def normalize(self, phone_number: str) -> Dict[str, Any]:
        """Normalize phone number to E164 format"""
        if not PHONENUMBERS_AVAILABLE:
            validation_result = self.validate(phone_number)
            if validation_result['is_valid']:
                return {
                    'is_valid': True,
                    'e164': validation_result['cleaned'],
                    'normalized': validation_result['cleaned'],
                    'country_code': self.default_region
                }
            return validation_result
        
        validation_result = self.validate(phone_number)
        
        if not validation_result['is_valid']:
            return validation_result
        
        try:
            parsed = validation_result['parsed']
            
            # Get country code
            country_code = phonenumbers.region_code_for_number(parsed)
            
            # Format to E164
            e164 = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
            
            # Get national format
            national = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.NATIONAL)
            
            return {
                'is_valid': True,
                'e164': e164,
                'national': national,
                'country_code': country_code,
                'normalized': e164,
                'parsed': parsed
            }
        except Exception as e:
            return {
                'is_valid': False,
                'error': str(e)
            }
    
    def validate_and_normalize(self, phone_number: str) -> Dict[str, Any]:
        """Validate and normalize phone number in one call"""
        return self.normalize(phone_number)


class EmailValidator:
    def __init__(self, allow_delivery_domain: bool = True):
        self.allow_delivery_domain = allow_delivery_domain
        # Basic email regex pattern
        self.email_pattern = re.compile(
            r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'
        )
    
    def validate(self, email: str) -> bool:
        """Validate email format"""
        if not email or not isinstance(email, str):
            return False
        
        # Basic pattern check
        if not self.email_pattern.match(email.strip()):
            return False
        
        # Additional checks
        email = email.strip().lower()
        
        # Length check
        if len(email) > 254:
            return False
        
        # Local part length check
        local_part = email.split('@')[0]
        if len(local_part) > 64:
            return False
        
        # Domain part checks
        domain_part = email.split('@')[1]
        
        # Check for consecutive dots
        if '..' in email:
            return False
        
        # Check for invalid characters
        invalid_chars = ['<', '>', '(', ')', '[', ']', '\\', ',', ';', ':', '"', ']']
        if any(char in email for char in invalid_chars):
            return False
        
        # Check if domain starts or ends with hyphen or dot
        if domain_part.startswith(('-', '.') or domain_part.endswith(('-', '.')):
            return False
        
        return True
    
    def get_domain(self, email: str) -> Optional[str]:
        """Extract domain from email"""
        if not self.validate(email):
            return None
        
        return email.strip().split('@')[1].lower()
    
    def is_disposable_domain(self, email: str) -> bool:
        """Check if email domain is disposable (basic check)"""
        domain = self.get_domain(email)
        if not domain:
            return True
        
        # List of common disposable email providers
        disposable_domains = [
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
            'mailinator.com', 'throwaway.email', 'yopmail.com'
        ]
        
        return domain in disposable_domains


# Global validator instances
phone_validator = PhoneValidator()
email_validator = EmailValidator()