import asyncio
import logging
import os
from dotenv import load_dotenv

# Import validators and database
from validators import phone_validator, email_validator
from database import db_manager
from keyboards import get_main_keyboard, get_contact_keyboard, get_service_types_keyboard, get_confirmation_keyboard

# Import aiogram
try:
    from aiogram import Bot, types, Router, F
    from aiogram.filters import Command, F
    from aiogram.types import ReplyKeyboardMarkup, InlineKeyboardMarkup, KeyboardButton, InlineKeyboardButton
except ImportError:
    print("aiogram not available. Install with: pip install aiogram==3.4.1")
    exit(1)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
BOT_TOKEN = os.getenv('BOT_TOKEN')
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///bot.db')

if not BOT_TOKEN:
    logger.error("BOT_TOKEN not found in environment variables")
    exit(1)

# Initialize FSM - Simple state management
class FSMContext:
    def __init__(self):
        self.state_data = {}
    
    def set_state(self, state_name):
        self.state_data['current'] = state_name
    
    def set_data(self, **kwargs):
        if 'current' in self.state_data:
            current_state = self.state_data['current']
            if current_state not in self.state_data:
                self.state_data[current_state] = {}
            self.state_data[current_state].update(kwargs)
    
    def get_data(self, key=None):
        current_state = self.state_data.get('current', {})
        if key:
            return current_state.get(key)
        return current_state
    
    def get_state(self):
        return self.state_data.get('current')
    
    def clear(self):
        self.state_data.clear()

# Form states
class ContactForm:
    name = "contact_form"
    phone = "phone_input"
    email = "email_input"
    confirmation = "confirmation"

class OrderForm:
    service_type = "service_type"
    details = "details"
    contact_info = "contact_info"
    confirmation = "confirmation"

class SurveyForm:
    current_question = "current_question"
    questions = "questions"
    answers = "answers"

class PhoneValidationForm:
    phone_input = "phone_input"

# Create router
router = Router()

# Main menu keyboard
def get_main_keyboard():
    """Create main menu keyboard"""
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📝 Заполнить анкету"), 
            [KeyboardButton(text="📋 Оставить заявку"), 
            [KeyboardButton(text="📊 Пройти опрос"), 
            [KeyboardButton(text="📱 Проверить номер"), 
            [KeyboardButton(text="❓ Помощь")]
        ],
        resize_keyboard=True,
        one_time_keyboard=True
    )

# Contact sharing keyboard
def get_contact_keyboard():
    """Create keyboard with contact sharing button"""
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📱 Отправить номер телефона", request_contact=True)], 
            [KeyboardButton(text="⏹️ Отмена", callback_data="cancel")]
        ],
        resize_keyboard=True,
        one_time_keyboard=True
    )

# Service types keyboard
def get_service_types_keyboard():
    """Create inline keyboard for service type selection"""
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="💻 IT-услуги", callback_data="service_it"), 
            [InlineKeyboardButton(text="🎨 Дизайн", callback_data="service_design"), 
            [InlineKeyboardButton(text="📝 Маркетинг", callback_data="service_marketing"), 
            [InlineKeyboardButton(text="🔧 Ремонт", callback_data="service_repair"), 
            [InlineKeyboardButton(text="📚 Обучение", callback_data="service_education")]
        ]
    )

# Confirmation keyboard
def get_confirmation_keyboard():
    """Create confirmation keyboard"""
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="✅ Подтвердить", callback_data="confirm_yes"), 
            [InlineKeyboardButton(text="❌ Отменить", callback_data="confirm_no")]
        ]
    )

# Initialize bot
bot = Bot(token=BOT_TOKEN)

# Scenario 1: Contact Data Collection
@router.message(CommandStart())
async def command_start_handler(message):
    """Handle /start command"""
    user_name = message.from_user.full_name
    await message.answer(
        f"Привет, {user_name}! 👋\n\n"
        f"Я многофункциональный бот, готовый помочь вам.\n\n"
        f"Выберите действие из меню или используйте команды:\n"
        f"/contact - заполнить контактные данные\n"
        f"/order - оставить заявку\n"
        f"/survey - пройти опрос\n"
        f"/validate - проверить номер телефона\n"
        f"/cancel - отменить текущее действие\n"
        f"/help - помощь",
        reply_markup=get_main_keyboard()
    )
    
    # Clear state
    fsm_context = FSMContext()
    fsm_context.clear()

@router.message(Command("cancel"))
async def cancel_handler(message):
    """Handle /cancel command"""
    fsm_context = FSMContext()
    fsm_context.clear()
    await message.answer(
        "Действие отменено. Вы в главном меню.",
        reply_markup=get_main_keyboard()
    )

@router.message(Command("help"))
async def help_handler(message):
    """Handle /help command"""
    help_text = """
🤖 <b>Помощь по боту</b>

<b>Основные команды:</b>
/start - начать работу с ботом
/cancel - отменить текущее действие
/help - показать это сообщение

<b>Функции бота:</b>
📝 <b>Заполнение анкеты</b>
- Сбор имени, телефона, email
- Валидация данных
- Сохранение в базе данных

📋 <b>Оставить заявку</b>
- Выбор типа услуги
- Сбор деталей заказа
- Подтверждение заявки

📊 <b>Пройти опрос</b>
- Серия вопросов по теме
- Сбор и сохранение ответов
- Результаты опроса

📱 <b>Проверка номера</b>
- Валидация формата телефона
- Нормализация номера
- Сохранение проверенного номера

<b>Контакты поддержки:</b>
Если у вас возникли проблемы, напишите администратору.
    """
    await message.answer(help_text, parse_mode="HTML")

# Scenario 1: Contact Data Collection
@router.message(Command("contact"))
async def start_contact_collection(message):
    """Start contact data collection"""
    fsm_context = FSMContext()
    fsm_context.set_state(ContactForm.name)
    await message.answer(
        "📝 <b>Заполнение анкеты</b>\n\n",
        parse_mode="HTML",
        reply_markup=ReplyKeyboardRemove()
    )

@router.message(F.text)
async def process_name(message):
    """Process name input"""
    fsm_context = FSMContext()
    name = message.text.strip()
    
    if len(name) < 2:
        await message.answer("Имя слишком короткое. Пожалуйста, введите полное имя:")
        return
    
    if len(name) > 50:
        await message.answer("Имя слишком длинное. Пожалуйста, введите имя до 50 символов:")
        return
    
    await fsm_context.set_data(name=name)
    await fsm_context.set_state(ContactForm.phone)
    await message.answer(
        f"Приятно познакомиться, {name}! 📱\n\n"
        "Теперь отправьте ваш номер телефона. "
        "Вы можете использовать кнопку ниже или ввести номер вручную:",
        reply_markup=get_contact_keyboard()
    )

@router.message(ContactForm.phone)
async def process_phone(message):
    """Process phone number"""
    fsm_context = FSMContext()
    
    # Handle contact sharing
    if message.contact:
        phone_number = message.contact.phone_number
    else:
        phone_number = message.text.strip()
    
    # Validate phone number
    validation_result = phone_validator.validate_and_normalize(phone_number)
    
    if not validation_result['is_valid']:
        await message.answer(
            f"Неверный формат номера телефона: {validation_result['error']}\n\n",
            "Пожалуйста, попробуйте еще раз или используйте кнопку для отправки контакта:",
            reply_markup=get_contact_keyboard()
        )
        return
    
    # Save normalized phone
    await fsm_context.set_data(
        phone=validation_result['e164'],
        phone_e164=validation_result['e164']
    )
    await fsm_context.set_state(ContactForm.email)
    await message.answer(
        f"Номер телефона сохранен: {validation_result['e164']}\n\n"
        "📧 Теперь введите ваш email (необязательно):",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[[KeyboardButton(text="Пропустить", resize_keyboard=True]]
        )
    )

@router.message(ContactForm.email)
async def process_email(message):
    """Process email input"""
    fsm_context = FSMContext()
    email = message.text.strip() if message.text != "Пропустить" else ""
    
    if email and not email_validator.validate(email):
        await message.answer(
            "Неверный формат email. Пожалуйста, введите корректный email или нажмите 'Пропустить':",
            reply_markup=ReplyKeyboardMarkup(
                keyboard=[[KeyboardButton(text="Пропустить", resize_keyboard=True]]
            )
        )
        return
    
    # Save data and show confirmation
    data = await fsm_context.get_data()
    confirmation_text = f"""
📋 <b>Проверьте ваши данные:</b>

👤 Имя: {data['name']}
📱 Телефон: {data['phone_e164']}
{f"📧 Email: {email}" if email else "📧 Email: не указан"}

Все верно?
    """
    
    await fsm_context.set_data(email=email)
    await fsm_context.set_state(ContactForm.confirmation)
    await message.answer(
        confirmation_text,
        parse_mode="HTML",
        reply_markup=get_confirmation_keyboard()
    )

@router.callback_query(F.data.startswith("confirm_"))
async def process_contact_confirmation(callback):
    """Process contact form confirmation"""
    fsm_context = FSMContext()
    action = callback.data.split("_")[1]
    data = await fsm_context.get_data()
    
    if action == "yes":
        # Save to database
        user_id = callback.from_user.id
        contact_data = {
            'user_id': user_id,
            'name': data['name'],
            'phone': data['phone'],
            'phone_e164': data['phone_e164'],
            'email': data.get('email', '')
        }
        
        await db_manager.save_contact(contact_data)
        
        await callback.message.answer(
            "✅ <b>Регистрация завершена!</b>\n\n"
            "Ваши данные успешно сохранены. "
            "Спасибо за предоставленную информацию!",
            parse_mode="HTML",
            reply_markup=get_main_keyboard()
        )
        await fsm_context.clear()
    else:
        await callback.message.answer(
            "❌ Регистрация отменена.",
            reply_markup=get_main_keyboard()
        )
        await fsm_context.clear()
    
    await callback.answer()

# Scenario 2: Order Processing
@router.message(Command("order"))
async def start_order_process(message):
    """Start order processing"""
    fsm_context = FSMContext()
    fsm_context.set_state(OrderForm.service_type)
    await message.answer(
        "📋 <b>Оформление заявки</b>\n\n",
        parse_mode="HTML",
        reply_markup=get_service_types_keyboard()
    )

@router.callback_query(F.data.startswith("service_"))
async def process_service_type(callback):
    """Process service type selection"""
    fsm_context = FSMContext()
    service_type = callback.data.split("_")[1]
    
    service_names = {
        'it': 'IT-услуги',
        'design': 'Дизайн',
        'marketing': 'Маркетинг',
        'repair': 'Ремонт',
        'education': 'Обучение'
    }
    
    service_name = service_names.get(service_type, service_type)
    
    await fsm_context.set_data(service_type=service_name)
    await fsm_context.set_state(OrderForm.details)
    await callback.message.answer(
        f"Вы выбрали: {service_name}\n\n",
        "Опишите подробно, какая услуга вам нужна:",
        reply_markup=ReplyKeyboardRemove()
    )
    await callback.answer()

@router.message(OrderForm.details)
async def process_order_details(message):
    """Process order details"""
    fsm_context = FSMContext()
    details = message.text.strip()
    
    if len(details) < 10:
        await message.answer("Слишком краткое описание. Пожалуйста, опишите подробнее:")
        return
    
    if len(details) > 1000:
        await message.answer("Слишком длинное описание. Пожалуйста, сократите текст до 1000 символов:")
        return
    
    await fsm_context.set_data(details=details)
    await fsm_context.set_state(OrderForm.contact_info)
    await message.answer(
        "✅ Описание получено.\n\n"
        "📞 Теперь оставьте ваши контактные данные для связи (телефон или email):",
        reply_markup=ReplyKeyboardRemove()
    )

@router.message(OrderForm.contact_info)
async def process_order_contact(message):
    """Process order contact information"""
    fsm_context = FSMContext()
    contact = message.text.strip()
    
    # Simple validation for phone or email
    is_phone = phone_validator.validate(contact)['is_valid']
    is_email = email_validator.validate(contact)
    
    if not (is_phone or is_email):
        await message.answer("Пожалуйста, введите корректный номер телефона или email для связи:")
        return
    
    data = await fsm_context.get_data()
    
    confirmation_text = f"""
📋 <b>Проверьте вашу заявку:</b>

🏷️ Услуга: {data['service_type']}
📝 Описание: {data['details']}
📞 Контакты: {contact}

Подтвердить отправку заявки?
    """
    
    await fsm_context.set_data(contact=contact)
    await fsm_context.set_state(OrderForm.confirmation)
    await message.answer(
        confirmation_text,
        parse_mode="HTML",
        reply_markup=get_confirmation_keyboard()
    )

@router.callback_query(F.data.startswith("confirm_"))
async def process_order_confirmation(callback):
    """Process order confirmation"""
    fsm_context = FSMContext()
    action = callback.data.split("_")[1]
    data = await fsm_context.get_data()
    
    if action == "yes":
        # Save order to database
        user_id = callback.from_user.id
        order_data = {
            'user_id': user_id,
            'service_type': data['service_type'],
            'details': data['details'],
            'contact': data['contact']
        }
        
        await db_manager.save_order(order_data)
        
        await callback.message.answer(
            "✅ <b>Заявка успешно отправлена!</b>\n\n"
            "Мы свяжемся с вами в ближайшее время. "
            "Номер вашей заявки сохранен в нашей системе.",
            parse_mode="HTML",
            reply_markup=get_main_keyboard()
        )
        await fsm_context.clear()
    else:
        await callback.message.answer(
            "❌ Заявка отменена.",
            reply_markup=get_main_keyboard()
        )
        await fsm_context.clear()
    
    await callback.answer()

# Scenario 3: Survey/Quiz
@router.message(Command("survey"))
async def start_survey(message):
    """Start survey"""
    fsm_context = FSMContext()
    questions = [
        "Как вы оцениваете качество наших услуг от 1 до 5?",
        "Какие функции вам понравились больше всего?",
        "Что бы вы хотели улучшить в нашем сервисе?",
        "Рекомендуете ли вы нас своим друзьям?",
        "Дополнительные комментарии или предложения?"
    ]
    
    await fsm_context.set_data(
        questions=questions,
        answers=[],
        current_question_index=0
    )
    await fsm_context.set_state(SurveyForm.current_question)
    await message.answer(
        "📊 <b>Начало опроса</b>\n\n",
        f"Вопрос 1 из {len(questions)}:\n",
        f"{questions[0]}",
        parse_mode="HTML"
    )

@router.message(SurveyForm.current_question)
async def process_survey_answer(message):
    """Process survey answers"""
    fsm_context = FSMContext()
    data = await fsm_context.get_data()
    questions = data['questions']
    answers = data['answers']
    current_index = data['current_question_index']
    
    answer = message.text.strip()
    answers.append(answer)
    
    if current_index < len(questions) - 1:
        # Ask next question
        next_index = current_index + 1
        await fsm_context.set_data(answers=answers, current_question_index=next_index)
        await message.answer(
            f"Вопрос {next_index + 1} из {len(questions)}:\n",
            f"{questions[next_index]}",
            parse_mode="HTML"
        )
    else:
        # Survey completed
        await fsm_context.set_data(answers=answers)
        
        # Save survey results
        user_id = message.from_user.id
        survey_data = {
            'user_id': user_id,
            'questions': questions,
            'answers': answers
        }
        
        await db_manager.save_survey(survey_data)
        
        await message.answer(
            "✅ <b>Опрос завершен!</b>\n\n"
            "Спасибо за ваше время и ценные ответы! "
            "Ваше мнение очень важно для нас.",
            parse_mode="HTML",
            reply_markup=get_main_keyboard()
        )
        await fsm_context.clear()

# Scenario 4: Phone Validation
@router.message(Command("validate"))
async def start_phone_validation(message):
    """Start phone validation"""
    fsm_context = FSMContext()
    fsm_context.set_state(PhoneValidationForm.phone_input)
    await message.answer(
        "📱 <b>Проверка номера телефона</b>\n\n",
        "Введите номер телефона для проверки и форматирования:",
        parse_mode="HTML",
        reply_markup=get_contact_keyboard()
    )

@router.message(PhoneValidationForm.phone_input)
async def process_phone_validation(message):
    """Process phone validation"""
    fsm_context = FSMContext()
    
    # Handle contact sharing
    if message.contact:
        phone_number = message.contact.phone_number
    else:
        phone_number = message.text.strip()
    
    # Validate phone number
    validation_result = phone_validator.validate_and_normalize(phone_number)
    
    if validation_result['is_valid']:
        # Save validated phone
        user_id = message.from_user.id
        phone_data = {
            'user_id': user_id,
            'original': phone_number,
            'normalized': validation_result['e164'],
            'e164': validation_result['e164'],
            'country_code': validation_result.get('country_code', 'RU')
        }
        
        await db_manager.save_validated_phone(phone_data)
        
        await message.answer(
            f"✅ <b>Номер телефона корректен!</b>\n\n"
            f"📱 Оригинал: {phone_number}\n"
            f"Страна: {validation_result.get('country_code', 'RU')}\n"
            f"Нормализованный: {validation_result['e164']}\n\n"
            "Номер сохранен в базе данных.",
            parse_mode="HTML",
            reply_markup=get_main_keyboard()
        )
    else:
        await message.answer(
            f"❌ <b>Неверный формат номера!</b>\n\n",
            f"Ошибка: {validation_result['error']}\n\n",
            "Пожалуйста, проверьте номер и попробуйте снова.",
            parse_mode="HTML"
        )
    
    await fsm_context.clear()

# Handle text messages when no state
@router.message()
async def handle_text_messages(message):
    """Handle text messages outside of any state"""
    fsm_context = FSMContext()
    current_state = await fsm_context.get_state()
    
    if current_state is None:
        await message.answer(
            "Пожалуйста, выберите действие из главного меню:",
            reply_markup=get_main_keyboard()
        )

async def main():
    """Main function to start the bot"""
    # Initialize database
    await db_manager.initialize()
    
    # Include router
    dp.include_router(router)
    
    # Start polling
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())