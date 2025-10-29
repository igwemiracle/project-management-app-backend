"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticateUser_1 = require("../middlewares/authenticateUser");
const card_controller_1 = require("../controllers/card.controller");
const router = (0, express_1.Router)();
router.post("/", authenticateUser_1.authenticateUser, card_controller_1.CreateCard);
// router.get("/:listId", authenticateUser, GetCards);
router.get("/", authenticateUser_1.authenticateUser, card_controller_1.GetCardsByBoard);
router.put("/:cardId", authenticateUser_1.authenticateUser, card_controller_1.UpdateCard);
router.delete("/:cardId", authenticateUser_1.authenticateUser, card_controller_1.DeleteCard);
exports.default = router;
//# sourceMappingURL=card.routes.js.map