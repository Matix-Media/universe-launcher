import axios from "axios"
import { Authenticator } from "minecraft-launcher-core"
import API from "./API"

export default class Account {
    mail!: string
    username: string | undefined
    accessToken: string | undefined
    clientToken: string | undefined
    UUID: string | undefined
    microsoft!: boolean
    loggedIn: boolean = false
    selectedProfile: any = undefined
    userProperties: any = undefined

    constructor(
        mail: string, 
        microsoft: boolean, 
        accessToken: string | undefined = undefined, 
        clientToken: string | undefined = undefined,
        UUID: string | undefined = undefined,
        selectedProfile: any = undefined,
        userProperties: any = undefined
    ) {
        this.mail = mail
        this.microsoft = microsoft
        this.accessToken = accessToken
        this.clientToken = clientToken
        this.UUID = UUID
        this.selectedProfile = selectedProfile
        this.userProperties = userProperties

        if (!microsoft) {
            if (this.UUID) {
                axios.get(API.SESSION + "/session/minecraft/profile/" + this.UUID.replace("-", ""))
                    .then((response) => {
                        console.log("Username for " + UUID + " fetched: " + response.data.name)
                        this.username = response.data.name
                    })
            }

            if (this.accessToken && this.clientToken) {
                Authenticator.validate(this.accessToken, this.clientToken)
                    .then((response) => {
                        if (response) {
                            this.loggedIn = true
                        } else {
                            if (this.accessToken && this.clientToken && this.selectedProfile) {
                            Authenticator.refreshAuth(this.accessToken, this.clientToken, this.selectedProfile)
                                .then((response) => {
                                    if (response) {
                                        this.accessToken = response.access_token
                                        this.clientToken = response.client_token
                                        this.UUID = response.uuid
                                        this.username = response.name
                                        this.userProperties = response.user_properties

                                        this.loggedIn = true
                                    }
                                })
                            }
                        }
                    })
            }
        }
    }

    /**
     * 
     * @returns The Object required by MCL-Core to launch a client
     */
    getAuthObj() {
        if (this.loggedIn)
            return {
                access_token: this.accessToken,
                client_token: this.clientToken,
                uuid: this.UUID,
                name: this.username,
                selected_profile: this.selectedProfile,
                user_properties: this.userProperties
            }
        else
            return undefined
    }

    login(password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!this.microsoft) {
                Authenticator.getAuth(this.mail, password)
                    .then((response) => {
                        this.UUID = response.uuid
                        this.accessToken = response.access_token
                        this.clientToken = response.client_token
                        this.username = response.name
                        this.userProperties = response.user_properties

                        this.loggedIn = true

                        resolve(true)
                    }).catch((response) => {
                        reject(false)
                    })
            }
        })
    }

    /**
     * 
     * @returns The mail of the Account
     */
    getMail(): string | undefined {
        return this.mail
    }

    /**
     * 
     * @returns The username of the Account
     */
    getUsername(): string | undefined {
        return this.username
    }

    /**
     * 
     * @returns The UUID of the Account
     */
    getUUID(): string | undefined {
        return this.UUID
    }

    /**
     * 
     * @returns If the Account is a Microsoft Account
     */
    isMicrosoft(): boolean {
        return this.microsoft
    }

}