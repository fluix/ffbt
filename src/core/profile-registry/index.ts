export interface Profile {
    _extends?: string;
    _displayName?: string;
}

export class ProfileRegistry<TProfile extends Profile> {
    private profiles = new Map<string, TProfile>();

    get size(): number {
        return this.profiles.size;
    }

    add(name: string, profile: TProfile): TProfile {
        const newProfile = this.extendProfile(profile);
        newProfile._displayName = name;

        this.profiles.set(name, newProfile);

        return newProfile;
    }

    private extendProfile(profile: TProfile): TProfile {
        if (!profile._extends) {
            return profile;
        }

        const parentProfile = this.get(profile._extends);

        return {
            ...parentProfile,
            ...profile,
        };
    }

    get(name: string): TProfile {
        const profile = this.profiles.get(name);

        if (!profile) {
            throw new Error(`Profile with name ${name} doesn't exist`);
        }

        return profile;
    }
}
