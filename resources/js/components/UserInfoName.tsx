import { type User } from '@/types';

export function UserInfoName({ user }: { user: User }) {
    return (
        <span>
            {user.name}
        </span>
    );
}