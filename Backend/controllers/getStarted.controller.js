const slugify = require('slugify');
const { User } = require("../models/user.model");
const { topics } = require("../data/topics");

const getTopics = async (req, res) => {
    try {
        res.status(200).json({ topicsData: topics });
    } catch (error) {
        console.log("Error coming while sending topics" + error);
        res.status(500).json({
            success: false,
            message: "Topics not fetched"
        });
    }
}

const saveTopics = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { selectedInterestedTopics } = req.body;

        // validate selectedInterestedTopics

        // check if selectedInterestedTopics is not an array 
        if (!Array.isArray(selectedInterestedTopics)) {
            return res.status(400).json({
                message: "selectedInterestedTopics should be an array"
            });
        }

        // validate length
        if (!selectedInterestedTopics || selectedInterestedTopics.length === 0) {
            return res.status(400).json({
                message: "selectedInterestedTopics array is required"
            });
        }

        // validate length of interestedTopics
        if (selectedInterestedTopics.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Select at least 3 topics"
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
            message: "Interested topics added successfully"
        })

    } catch (error) {
        console.log("Error coming while saving interested topics" + error);
        res.status(500).json({
            success: false,
            message: "Topics not saved",
            Error: error.message,
        })
    }
}

module.exports = { getTopics, saveTopics };