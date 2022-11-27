import * as argon2 from 'argon2';

class AuthService {
    async SignUp(email, password, name){
        const passwordHashed = await argon2.hash(password);

        const userRecord = await UserModel.create({
        password: passwordHashed,
        email,
        name,
        });
        return {
        // Никогда не передавайте куда-либо пароль!!!
        user: {
            email: userRecord.email,
            name: userRecord.name,
        },
        }
    }
}