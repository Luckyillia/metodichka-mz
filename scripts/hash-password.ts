import bcrypt from 'bcryptjs'

async function hashPassword() {
    const password = "illia2107" // ИЗМЕНИТЕ!
    const hash = await bcrypt.hash(password, 10)
    console.log("Хешированный пароль:", hash)
}

hashPassword()