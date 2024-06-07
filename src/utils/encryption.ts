import Aes from 'react-native-aes-crypto';
export async function encrypt(text: string, key: string) {
    return await Aes.encrypt(text, key, key, 'aes-128-cbc')
}
export async function decrypt(text: string, key: string) {
    try {
        return await Aes.decrypt(text, key, key, 'aes-128-cbc')
    } catch (e) {
        console.log(e)
        return undefined
    }
}