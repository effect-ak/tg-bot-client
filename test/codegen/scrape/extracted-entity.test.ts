import { describe, expect, assert } from "vitest"

import { fixture } from "../fixture";

describe("extracted-entity", () => {

  fixture("InputFile", ({ page }) => {

    const entity = page.getEntity("InputFile");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");
    expect(entity.right.entityName).toEqual("InputFile");

    assert(entity.right.type.type == "normalType");

    expect(entity.right.type.normalType.getTsType()).toEqual("File");

  });

  fixture("sendMediaGroup", ({ page }) => {

    const entity = page.getEntity("sendMediaGroup");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");
    expect(entity.right.entityName).toEqual("sendMediaGroup");
    expect(entity.right.entityDescription.returns?.typeNames).toEqual(["Message[]"]);

    assert(entity.right.type.type == "fields");
    const field1 = entity.right.type.fields.find(_ => _.name == "media");

    expect(field1?.type.getTsType()).toEqual(
      "(T.InputMediaAudio | T.InputMediaDocument | T.InputMediaPhoto | T.InputMediaVideo)[]"
    );

  });

  fixture("setGameScore", ({ page }) => {

    const entity = page.getEntity("setGameScore");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");
    expect(entity.right.entityName).toEqual("setGameScore");
    expect(entity.right.entityDescription.returns?.typeNames).toEqual(["Message", "boolean"]);

  });

  fixture("getStarTransactions", ({ page }) => {

    const entity = page.getEntity("getStarTransactions");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");
    expect(entity.right.entityName).toEqual("getStarTransactions");
    expect(entity.right.entityDescription.returns?.typeNames).toEqual(["StarTransactions"]);

  });

  fixture("deleteMessage", ({ page }) => {

    const entity = page.getEntity("deleteMessage");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");
    expect(entity.right.entityName).toEqual("deleteMessage");
    expect(entity.right.entityDescription.returns?.typeNames).toEqual(["boolean"]);

  });
  
  fixture("getWebhookInfo", ({ page }) => {

    const entity = page.getEntity("getWebhookInfo");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");
    expect(entity.right.entityName).toEqual("getWebhookInfo");
    expect(entity.right.entityDescription.returns?.typeNames).toEqual(["WebhookInfo"]);

  });

  fixture("ReplyKeyboardMarkup", ({ page }) => {

    const entity = page.getEntity("ReplyKeyboardMarkup");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");
    expect(entity.right.entityName).toEqual("ReplyKeyboardMarkup");
    expect(entity.right.entityDescription.returns).toBeUndefined();
    assert(entity.right.type.type == "fields");

    const field1 = entity.right.type.fields.find(_ => _.name == "keyboard");
    
    expect(field1?.type.getTsType()).toEqual("KeyboardButton[][]");

  });

  fixture("User", ({ page }) => {

    const entity = page.getEntity("User");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");
    expect(entity.right.entityName).toEqual("User");
    expect(entity.right.entityDescription.returns).toBeUndefined();
    assert(entity.right.type.type == "fields");
    expect(entity.right.type.fields.map(_ => _.name)).containSubset(["id", "is_bot", "username"]);

  });


  fixture("forwardMessages", ({ page }) => {

    const entity = page.getEntity("forwardMessages");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");
    expect(entity.right.entityName).toEqual("forwardMessages");
    expect(entity.right.entityDescription.returns?.typeNames).toEqual(["MessageId[]"])

  });

  fixture("Chat", ({ page }) => {

    const entity = page.getEntity("Chat");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");

    expect(entity.right.entityName).toEqual("Chat");
    expect(entity.right.entityDescription.lines[0]).toEqual("This object represents a chat");

    assert(entity.right.type.type == "fields");
    expect(entity.right.type.fields.length).greaterThan(1);

    const titleField = entity.right.type.fields.find(_ => _.name == "title");

    expect(titleField?.description.at(0)).toEqual("Title, for supergroups, channels and group chats")
    expect(titleField?.type.getTsType()).toEqual("string");
    expect(titleField?.required).toEqual(false);

    const typeField = entity.right.type.fields.find(_ => _.name == "type");
    
    expect(typeField?.description.at(0)).toEqual("Type of the chat, can be either “private”, “group”, “supergroup” or “channel”")

  });

  fixture("Message", ({ page }) => {

    const entity = page.getEntity("Message");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");

    expect(entity.right.entityName).toEqual("Message");
    assert(entity.right.type.type == "fields");

    expect(entity.right.type.fields.length).greaterThan(80);

  });

  fixture("getMyCommands", ({ page }) => {

    const entity = page.getEntity("getMyCommands");

    if (entity._tag == "Left") console.log(entity.left);

    assert(entity._tag == "Right");

    expect(entity.right.entityName).toEqual("getMyCommands");
    assert(entity.right.type.type == "fields");

    expect(entity.right.type.fields).toHaveLength(2);
    expect(entity.right.entityDescription.returns?.typeNames).toEqual(["BotCommand[]"]);

  });

  fixture("logOut", ({ page }) => {

    const entity = page.getEntity("logOut");

    assert(entity._tag == "Right");

    expect(entity.right.entityName).toEqual("logOut");
    assert(entity.right.type.type == "normalType");

    expect(entity.right.type.normalType.getTsType()).toEqual("never");
    expect(entity.right.entityDescription.returns?.typeNames).toEqual(["boolean"]);

  });

  fixture("getMe", ({ page }) => {

    const entity = page.getEntity("getMe");

    assert(entity._tag == "Right");

    expect(entity.right.entityName).toEqual("getMe");
    assert(entity.right.type.type == "normalType");

    expect(entity.right.type.normalType.getTsType()).toEqual("never")

  });

  fixture("sendChatAction", ({ page }) => {

    const entity = page.getEntity("sendChatAction");

    assert(entity._tag == "Right");

    expect(entity.right.entityName).toEqual("sendChatAction");
    expect(entity.right.type.type).toEqual("fields");

  });

  fixture("ForumTopicClosed", async ({ page }) => {

    const entity = page.getEntity("forumTopicClosed");

    assert(entity._tag == "Right");

    assert(entity.right.type.type == "normalType");

    expect(entity.right.type.normalType.getTsType()).toEqual("never");

    // expect(entity.right.entityName).toEqual("forumTopicClosed");
    // expect(entity.right.type.type).toEqual("fields");
    // expect(entity.right.entityDescription).not.toEqual([]);

  });

  fixture("ChatFullInfo", ({ page }) => {

    const entity = page.getEntity("ChatFullInfo");

    assert(entity._tag == "Right");

    expect(entity.right.entityDescription.lines[0]).match(/^This object contains full.*/);

    assert(entity.right.type.type == "fields");

    const field1 = entity.right.type.fields.find(_ => _.name == "accent_color_id");

    expect(field1?.required).toBeTruthy();
    expect(field1?.type.getTsType()).toEqual("number");

    const field2 = entity.right.type.fields.find(_ => _.name == "available_reactions");
    expect(field2?.type.getTsType()).toEqual("ReactionType[]");
    expect(field2?.required).toBeFalsy();

    const lastNameField = entity.right.type.fields.find(_ => _.name == "last_name");
    expect(lastNameField?.type.getTsType()).toEqual("string");
    expect(lastNameField?.required).toBeFalsy();
    expect(lastNameField?.description).toEqual([
      "Last name of the other party in a private chat"
    ]);

  })

});
