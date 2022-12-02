const Axios = require('axios');

const errors = {
    204: {
        status: 204,
        msg: 'This username does not exist.'
    },
    400: {
        status: 400,
        msg: 'The given username is invalid.'
    },
    404: {
        status: 404,
        msg: 'This username does not exist.'
    }
};

class PlayerManager {
    constructor(player) {
        this.player = player;
    }

    async usernameToUUID() {
        try {
            const { status, data } = await Axios.get(`https://api.mojang.com/users/profiles/minecraft/${this.player}`);
            return { status, ...data };
        } catch ({ response: { status } }) {
            return errors[status];
        }
    }
}

module.exports = PlayerManager;