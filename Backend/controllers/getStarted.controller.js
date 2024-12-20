const slugify = require("slugify");
const { User } = require("../models/user.model");
const { topics } = require("../data/topics");

const getTopics = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Topics fetched successfully",
      topicsData: topics,
    });
  } catch (error) {
    console.log("Error coming while sending topics" + error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const saveTopics = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { selectedInterestedTopics } = req.body;

    // Validate selectedInterestedTopics
    if (!Array.isArray(selectedInterestedTopics)) {
      return res.status(400).json({
        success: false,
        message: "selectedInterestedTopics should be an array",
      });
    }

    if (!selectedInterestedTopics || selectedInterestedTopics.length === 0) {
      return res.status(400).json({
        success: false,
        message: "selectedInterestedTopics array is required",
      });
    }

    if (selectedInterestedTopics.length < 3) {
      return res.status(400).json({
        success: false,
        message:
          "Please select at least 3 topics to proceed. This helps us provide relevant content.",
      });
    }

    // Slugify all selected topics
    const sluggedSelectedInterestedTopics = selectedInterestedTopics.map(
      (topic) => slugify(topic, { lower: true, strict: true })
    );

    // Find and update user's interestedTopics
    const updatedUser = await User.findByIdAndUpdate(
      { _id: loggedInUser._id },
      {
        $addToSet: {
          interestedTopics: { $each: sluggedSelectedInterestedTopics },
        },
        isSelectedTopics: true,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      user: updatedUser,
      success: true,
      message: "Your selected topics have been added successfully",
    });
  } catch (error) {
    console.log("Error coming while saving interested topics" + error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getTopics, saveTopics };
