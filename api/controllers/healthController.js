const healthEndpoint = async (req, res) => {
    try {
        res.status(200).send({ message: "node-app running, healthy!" });
    } catch (error) {
        res.status(500).send({ message: "failed to hit health endpoint" });
    }
}

module.exports = { healthEndpoint };