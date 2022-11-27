const {Client_connect} = require('./model.js')
const argon = require('argon2');
const jwt = require('jsonwebtoken')

const Model = new Client_connect('users');

class AuthService {
    async SignUp(username, password, course, group, userid){
        const passwordHashed = await argon.hash(password);

        const userRecord = await Model.PUST({
        'password': passwordHashed,
        'username': username,
        'course': course,
        'group': group,
        'userid': userid,
        });
        return {
            user: {
                username: username,
            },
        }
    }

    async Login(username, password){
        await Model.GET({ 'keys': '*', 'where': {'username': username}});
        let userRecord = Model.request
        userRecord = userRecord[0];
        //console.log(userRecord)
        if (!userRecord) {
          throw new Error('User not found')
        } 
        else {
            console.log(userRecord.password, password)
            const correctPassword = await argon.verify(userRecord.password, password);
            if (!correctPassword) {
                throw new Error('Incorrect password')
            }
            
        
            return {
                user: {
                    username: userRecord.username,
                },
                token: this.generateJWT(userRecord),
        
            }
        
        }
    }

    async generateJWT(user){
        let data = {
            
        }
    }
}


let auth = new AuthService()
auth.SignUp('user', 'password', 1, 1, 1)
auth.Login('user', 'password')