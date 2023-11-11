const loadIndex = (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.log("loadIndex error", error.message);
    };
};

module.exports = {
    loadIndex,
};