import bcrypt from 'bcryptjs'
//$2b$10$hePLP7JcnTHyzQARTV/PtuXwUSPHTYxtZ0Le7HVJs0rIJ.1B1LmCq
async function hashPassword() {
    const password = "root" // ИЗМЕНИТЕ!
    const hash = await bcrypt.hash(password, 10)
    console.log("Хешированный пароль:", hash)
}

hashPassword()