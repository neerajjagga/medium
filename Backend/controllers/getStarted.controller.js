const slugify = require("slugify");
const { User } = require("../models/user.model");
const { topics } = require("../data/topics");

const getTopics = async (req, res) => {
<<<<<<< HEAD
    try {
        res.status(200).json({ 
            success : true,
            message : "Topics fetched successfully",
            topicsData: topics 
        });
    } catch (error) {
        console.log("Error coming while sending topics" + error);
        res.status(500).json({
            success: false,
            message: "Topics not fetched",
            Error : error.message,
        });
    }
}
=======
  try {
    res.status(200).json({ topicsData: topics });
  } catch (error) {
    console.log("Error coming while sending topics" + error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
>>>>>>> e6d5e83 (Frontend Added!)

const saveTopics = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { selectedInterestedTopics } = req.body;

    // validate selectedInterestedTopics

<<<<<<< HEAD
        // check if selectedInterestedTopics is not an array 
        if (!Array.isArray(selectedInterestedTopics)) {
            return res.status(400).json({
                success : false,
                message: "selectedInterestedTopics should be an array"
            });
        }

        // validate length
        if (!selectedInterestedTopics || selectedInterestedTopics.length === 0) {
            return res.status(400).json({
                success : false,
                message: "selectedInterestedTopics array is required"
            });
        }

        // validate length of interestedTopics
        if (selectedInterestedTopics.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Please select at least 3 topics to proceed. This helps us provide relevant content."
            })
        }

        // slugify all selected topics
        const sluggedSelectedInterestedTopics = selectedInterestedTopics.map(topic => slugify(topic, { lower: true, strict: true }));

        // find and update user interestedTopics 
        await User.findByIdAndUpdate({ _id: loggedInUser._id }, {
            $addToSet: { interestedTopics: { $each: sluggedSelectedInterestedTopics } },
            isSelectedTopics: true,
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Your selected topics have been added successfully"
        })

    } catch (error) {
        console.log("Error coming while saving interested topics" + error);
        res.status(500).json({
            success: false,
            message: "An error occurred while saving your selected topics. Please try again later.",
            Error: error.message,
        })
=======
    // check if selectedInterestedTopics is not an array
    if (!Array.isArray(selectedInterestedTopics)) {
      return res.status(400).json({
        message: "selectedInterestedTopics should be an array",
      });
>>>>>>> e6d5e83 (Frontend Added!)
    }

    // validate length
    if (!selectedInterestedTopics || selectedInterestedTopics.length === 0) {
      return res.status(400).json({
        message: "selectedInterestedTopics array is required",
      });
    }

    // validate length of interestedTopics
    if (selectedInterestedTopics.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Select at least 3 topics",
      });
    }

    // slugify all selected topics
    const sluggedSelectedInterestedTopics = selectedInterestedTopics.map(
      (topic) => slugify(topic, { lower: true, strict: true })
    );

    // find and update user interestedTopics
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
      message: "Interested topics added successfully",
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
