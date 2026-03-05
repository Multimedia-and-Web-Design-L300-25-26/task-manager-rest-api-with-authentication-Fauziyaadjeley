import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Validate input
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    
    // Create task with owner
    const task = new Task({
      title,
      description,
      owner: req.user._id
    });
    
    await task.save();
    
    return res.status(201).json({
      _id: task._id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      owner: task.owner,
      createdAt: task.createdAt
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create task" });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    // Return only tasks belonging to req.user
    const tasks = await Task.find({ owner: req.user._id });
    
    return res.status(200).json(
      tasks.map(task => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        owner: task.owner,
        createdAt: task.createdAt
      }))
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to retrieve tasks" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find task
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    // Check ownership
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    // Delete task
    await Task.findByIdAndDelete(id);
    
    return res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;