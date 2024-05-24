type User = {
    name: string,
    email: string,
    uid: string
}
export function User({
    uid,
    name,
    email,
}: {
    uid: string;
    name: string;
    email: string;
}): User {
    return {
        uid: uid,
        name: name,
        email: email,
    };
}