export const type_node_set = new Set([ "TABLE", "UL" ]);
export const new_entity_tag_set = new Set([...type_node_set, "H4"]);

export const optional_field_label = "Optional";

export const returnTypeOverrides: Record<string, [string, ...string[]]> = {
  sendMediaGroup: [ "Message[]" ]
} as const;

export const typeAliasOverrides: Record<string, string> = {
  InputFile: "{ file_content: Uint8Array, file_name: string }"
}
