

const signupUser = async(req, res) => {
    try {
        res.send("Hello");
    } catch (error) {
        console.log("Error coming while singup user" + error);
    }
}

module.exports = {signupUser};