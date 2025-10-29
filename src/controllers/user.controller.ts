import { User } from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { attachCookiesToResponse } from "../utils/attachCookiesToResponse";


// ✅ GET ALL USERS (Admin only)
export const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ GET PROFILE OF AUTHENTICATED USER
export const GetProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ GET OWNED ACCOUNTS
// export const getOwnedAccounts = async (req: Request, res: Response) => {
//   try {
//     const currentUser = await User.findById(req.user?.id);
//     if (!currentUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // If current user is a sub-account, use its owner's ID
//     const ownerId = currentUser.owner ? currentUser.owner : currentUser._id;

//     // Fetch all accounts owned by that owner (including the main)
//     const accounts = await User.find({
//       $or: [{ _id: ownerId }, { owner: ownerId }],
//     }).select("fullName username email isVerified")
//       .lean();

//     res.status(200).json({ accounts });
//   } catch (error) {
//     console.error("Error fetching owned accounts:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// ✅ PUBLIC: GET OWNED ACCOUNTS (for logged-out users)
// export const getPublicOwnedAccounts = async (req: Request, res: Response) => {
//   try {
//     const { ownerId } = req.params;

//     const accounts = await User.find({
//       $or: [{ _id: ownerId }, { owner: ownerId }],
//     }).select("fullName username email isVerified");

//     res.status(200).json({ accounts });
//   } catch (error) {
//     console.error("Error fetching owned accounts (public):", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ✅ SWITCH ACCOUNTS
// export const switchAccount = async (req: Request, res: Response) => {
//   try {
//     const { accountId } = req.params;
//     const currentUserId = req.user?.id;

//     const currentUser = await User.findById(currentUserId);
//     if (!currentUser) {
//       return res.status(404).json({ message: "Current user not found" });
//     }

//     const ownerId = currentUser.owner || currentUser._id;

//     const targetAccount = await User.findById(accountId);
//     if (!targetAccount) {
//       return res.status(404).json({ message: "Target account not found" });
//     }

//     const targetOwnerId = targetAccount.owner || targetAccount._id;

//     if (targetOwnerId.toString() !== ownerId.toString()) {
//       return res.status(403).json({ message: "Unauthorized switch attempt" });
//     }

//     // ✅ Attach cookie for switched account
//     attachCookiesToResponse(res, {
//       userId: targetAccount._id.toString(),
//       role: targetAccount.role,
//     });

//     res.json({
//       message: "Switched successfully",
//       user: {
//         _id: targetAccount._id,
//         owner: targetAccount.owner || targetAccount._id,
//         fullName: targetAccount.fullName,
//         username: targetAccount.username,
//         email: targetAccount.email,
//         isVerified: targetAccount.isVerified,
//       },
//     });
//   } catch (error) {
//     console.error("Error switching account:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// ✅ CREATE SUB-ACCOUNTS
// export const createSubAccount = async (req: Request, res: Response) => {
//   try {
//     const ownerId = req.user?.id;
//     if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

//     const { fullName, username, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "Email already in use" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const subAccount = await User.create({
//       fullName,
//       username,
//       email,
//       password: hashedPassword,
//       isVerified: true,
//       owner: ownerId,
//     });

//     // 🔄 Maintain consistency — push subAccount._id to parent's subAccounts
//     await User.findByIdAndUpdate(ownerId, {
//       $push: { subAccounts: subAccount._id },
//     });

//     res.status(201).json({
//       message: "Sub-account created successfully",
//       user: subAccount,
//     });
//   } catch (error) {
//     console.error("Error creating subaccount:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// ✅ CREATE SUB-ACCOUNTS
// controllers/userController.ts (replace current removeSubAccount)
// export const removeSubAccount = async (req: Request, res: Response) => {
//   const accountId = req.params.id;
//   const currentUserId = req.user?.id;

//   try {
//     // 1) load the user who is making the request (could be main owner or a sub-account)
//     const currentUser = await User.findById(currentUserId);
//     if (!currentUser) {
//       return res.status(404).json({ message: "Current user not found" });
//     }

//     // 2) decide the "owner" id (if requester is a sub-account, use its owner; otherwise use requester)
//     const ownerId = currentUser.owner ? currentUser.owner : currentUser._id;

//     // 3) fetch the target account (the one to remove) and confirm it belongs to the same owner
//     const targetAccount = await User.findById(accountId);
//     if (!targetAccount) {
//       return res.status(404).json({ message: "Target account not found" });
//     }

//     const targetOwnerId = targetAccount.owner ? targetAccount.owner : targetAccount._id;
//     if (targetOwnerId.toString() !== ownerId.toString()) {
//       return res.status(403).json({ message: "You are not authorized to remove this account" });
//     }

//     // 4) pull the sub-account id from the owner's subAccounts array
//     const updatedOwner = await User.findByIdAndUpdate(
//       ownerId,
//       { $pull: { subAccounts: accountId } },
//       { new: true }
//     ).populate("subAccounts", "_id fullName email username");

//     if (!updatedOwner) {
//       return res.status(404).json({ message: "Owner user not found" });
//     }

//     // 5) Optional: decide if you want to delete the sub-account document or just unlink it.
//     //    - If you want to delete the user document entirely, uncomment the next line:
//     // await User.findByIdAndDelete(accountId);
//     //
//     //    - If you want to keep the sub-account record but clear its owner (so it becomes a standalone user),
//     // uncomment:
//     await User.findByIdAndUpdate(accountId, { owner: null });

//     // 6) return the updated list of subAccounts to the client
//     return res.json({ subAccounts: updatedOwner.subAccounts });
//   } catch (err) {
//     console.error("removeSubAccount error:", err);
//     return res.status(500).json({ message: "Failed to remove account from this browser" });
//   }
// };






// ✅ GET SINGLE USER (Authenticated)
export const GetSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Only the user themselves or an admin can view
    if (req.user?.id !== userId && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this user" });
    }

    const user = await User.findById(userId)
      .select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ SHOW CURRENT USER (Authenticated)
export const ShowCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const currentUser = await User.findById(req.user.id).select("-password");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: currentUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ DELETE USER (Admin only)
export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};