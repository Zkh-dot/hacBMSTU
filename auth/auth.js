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
        'groupe': group,
        'userid': userid + group * 100 + course * 1000,
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
        if (!userRecord) {
          throw new Error('User not found')
        } 
        else {
            console.log(userRecord.password, password)
            const correctPassword = await argon.verify(userRecord.password, password);
            //console.log('cp', correctPassword)
            if (!correctPassword) {
                throw new Error('Incorrect password')
            }
            let token = await this.generateJWT(userRecord);
            
            return token;
        
        }
    }

    async generateJWT(user){

        const data =  {
          id: user.id,
          username: user.usernamename,
          userid: user.userid
        }
        const signature = user.password;
        const expiration = '6h';
    
        return jwt.sign({ data, }, signature, { expiresIn: expiration });
      
    }
}


async function tests(){
    let auth = new AuthService()
    //auth.SignUp('user', 'password', 1, 1, 1)
    let a = auth.Login('user', 'password')
}
