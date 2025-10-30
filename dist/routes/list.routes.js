"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticateUser_1 = require("../middlewares/authenticateUser");
const list_controller_1 = require("../controllers/list.controller");
const router = (0, express_1.Router)();
router.post("/", authenticateUser_1.authenticateUser, list_controller_1.CreateList);
router.get("/", authenticateUser_1.authenticateUser, list_controller_1.GetListsByBoard);
router.get("/showAll", authenticateUser_1.authenticateUser, list_controller_1.GetAllLists);
router.put("/:listId", authenticateUser_1.authenticateUser, list_controller_1.UpdateList);
router.patch("/:id", authenticateUser_1.authenticateUser, list_controller_1.UpdateListColor);
router.delete("/:listId", authenticateUser_1.authenticateUser, list_controller_1.DeleteList);
exports.default = router;
//# sourceMappingURL=list.routes.js.map