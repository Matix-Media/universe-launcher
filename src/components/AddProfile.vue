<template>
    <div>
        <div
            v-if="!accountType && !loggedIn"
            key="options-selecton-screen"
            class="screen options-selection-screen"
        >
            <div class="login-options">
                <button
                    @click="
                        accountType = 'microsoft';
                        msLogin();
                    "
                >
                    <img src="../assets/images/account-types/microsoft-logo.png" alt="Microsoft" />
                </button>
                <button @click="accountType = 'mojang'">
                    <img src="../assets/images/account-types/mojang-logo.png" alt="Mojang" />
                </button>

                <p class="info">
                    Don't have an account yet?
                </p>
                <a
                    href="https://www.minecraft.net/de-de/store/minecraft-java-edition"
                    target="_blank"
                >
                    Register a Minecraft: Java Edition account now!
                </a>
            </div>
        </div>
        <div
            key="mojang-login-screen"
            v-if="accountType && accountType == 'mojang' && !loggedIn"
            class="screen"
        >
            <label :class="{ error: wrongCredentials }">
                <p>Email</p>
                <input
                    type="email"
                    class="text-box"
                    :readonly="loggingIn"
                    @keyup="handleKeypress"
                    v-model="email"
                    placeholder="mail@example.com"
                />
                <span class="error-info">Wrong email/password.</span>
            </label>

            <label :class="{ error: wrongCredentials }">
                <p>Password</p>
                <input
                    type="password"
                    class="text-box"
                    :readonly="loggingIn"
                    @keyup="handleKeypress"
                    v-model="password"
                    placeholder="••••••••••••••"
                />
                <span class="error-info">Wrong email/password.</span>
            </label>
            <button class="login-button" @click="login">
                {{ loggingIn ? "Logging in..." : "Login" }}
            </button>
        </div>
        <div
            v-if="accountType && accountType == 'microsoft' && !loggedIn && msLoginError == null"
            key="ms-login-screen"
            class="ms-login-screen"
        >
            <i class="fas fa-info-circle" v-if="msLoginProgress == 0"></i>
            <p>
                {{
                    msLoginProgress == 0 ? "Please login using the popup window." : "Logging in..."
                }}
            </p>
            <div class="progress" v-if="msLoginProgress > 0">
                <span :style="{ width: msLoginProgress + '%' }"></span>
            </div>
        </div>

        <div v-if="msLoginError != null" key="ms-error-screen" class="ms-error-screen">
            <i class="fas fa-times"></i>

            <p>{{ msLoginError }}</p>
        </div>

        <div v-if="loggedIn" class="screen success-screen">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>

            <p>Successfully logged in.</p>
        </div>
    </div>
</template>

<script>
//import { MSLogin } from "../classes/microsoft";
const { ipcRenderer } = require("electron");

export default {
    name: "AddProfile",
    data() {
        return {
            accountType: null,
            email: "",
            password: "",
            loggingIn: false,
            loggedIn: false,
            wrongCredentials: false,
            msLoginProgress: 0,
            msLoginError: null,
        };
    },
    methods: {
        async msLogin() {
            ipcRenderer.send("login_oauth2_ms");
            ipcRenderer.once("login_oauth2_ms_error", async (event, err) => {
                this.msLoginError = err;
            });
            ipcRenderer.once("login_oauth2_ms_callback", async (event, call) => {
                var result = this.$api.addProfile("microsoft", call);
                this.loggedIn = true;
                setTimeout(() => this.$emit("loggedIn", result), 1000);
            });
            ipcRenderer.on("login_oauth2_ms_update", (event, update) => {
                if (update["type"] == "Loading") {
                    this.msLoginProgress = update.percent;
                    console.log("MS-Login (" + update.percent + "%):", update.data);
                } else if (update.type == "Error" || update.type == "Rejection") {
                    this.msLoginError = update.data;
                } else if (update.type == "Cancelled") {
                    this.msLoginError = "Login cancelled.";
                }
            });
        },
        async login() {
            if (this.loggingIn) return;

            this.loggingIn = true;
            var result = await this.$api.addProfile("mojang", {
                email: this.email,
                password: this.password,
            });
            if (result === false) {
                this.loggingIn = false;
                this.wrongCredentials = true;
                this.password = "";
                return;
            }
            this.loggingIn = false;
            this.loggedIn = true;
            setTimeout(() => this.$emit("loggedIn", result), 1000);
        },
        handleKeypress(event) {
            if (event.key == "Enter") {
                this.login();
            }
        },
    },
};
</script>

<style scoped>
.ms-login-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.ms-login-screen i {
    font-size: 3rem;
    margin: 0.5rem 0;
    color: rgba(255, 255, 255, 0.65);
}

.ms-login-screen p {
    font-size: 1rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.ms-login-screen .progress {
    margin-top: 0.5rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    height: 0.7rem;
    width: 100%;
    overflow: hidden;
}

.ms-login-screen .progress span {
    display: block;
    height: 100%;
    transition: width 0.2s;
    background-color: rgba(98, 113, 126, 0.6);
}

.ms-error-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.ms-error-screen i {
    color: rgba(231, 77, 60, 0.6);
    font-size: 100px;
    margin-bottom: 1rem;
    animation: fadeIn ease-in-out 0.4s;
}

.ms-error-screen p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.5rem;
    animation: fadeIn ease-in-out 0.4s;
}

.screens {
    overflow: hidden;
    position: relative;
}

.screen {
    display: inline-block;
    width: 100%;
}

.slide-leave-active,
.slide-enter-active {
    transition: 0.5s;
}
.slide-enter {
    transform: translate(100%, 0);
    position: absolute;
    top: 0;
}
.slide-leave-to {
    transform: translate(-110%, 0);
    position: absolute;
    top: 0;
}

.login-options button {
    border: none;
    border-radius: 4px;
    padding: 0.5rem 2rem;
    margin-top: 1rem;
    color: white;
    background-color: rgba(53, 66, 75, 0.9);
    cursor: pointer;
    font-family: "Roboto";
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: 300;
    transition: background-color 0.2s;
    width: 100%;
    box-sizing: border-box;
}

.login-options button:hover {
    background-color: rgba(53, 66, 75, 0.6);
}

.login-options button:first-of-type {
    margin-top: 0;
}

.login-options button img {
    height: 2rem;
}

.login-button {
    border: none;
    border-radius: 4px;
    padding: 0.5rem 2rem;
    margin-top: 1rem;
    color: white;
    background-color: rgba(53, 66, 75, 0.9);
    cursor: pointer;
    font-family: "Roboto";
    text-transform: uppercase;
    font-size: 0.9rem;
    font-weight: 300;
    transition: background-color 0.2s;
    width: 100%;
    box-sizing: border-box;
}

.login-button:hover,
.login-button:focus {
    background-color: rgba(53, 66, 75, 0.6);
}

label .text-box {
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 3px;
    color: white;
    padding: 0.4rem 0.8rem;
    font-family: "Roboto";
    font-size: 1rem;
    transition: background-color 0.2s;
    -webkit-appearance: none;
    font-weight: 300;
    width: 100%;
    box-sizing: border-box;
}
label .text-box:focus {
    background-color: rgba(255, 255, 255, 0.3);
}

label .text-box:read-only {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
}

label.error .text-box {
    background-color: rgba(231, 77, 60, 0.2);
}

label.error .text-box:focus {
    background-color: rgba(231, 77, 60, 0.3);
}

label.error .text-box:read-only {
    background-color: rgba(231, 77, 60, 0.1);
}

label span.error-info {
    display: block;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.2s ease-out;
    color: rgba(231, 77, 60, 0.6);
    font-size: 0.8rem;
    margin-top: 0.1rem;
}

label.error span.error-info {
    max-height: 1rem;
}

label {
    display: block;
    margin-bottom: 1rem;
}

label p {
    font-size: 0.9rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.2rem;
}

.checkbox {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
}

p.info {
    font-size: 0.85rem;
    margin-top: 2rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.8);
}

a:link,
a:visited {
    font-size: 0.85rem;
    color: rgb(132, 185, 235);
    font-weight: 500;
    text-decoration: none;
}
a:link:hover,
a:visited:hover {
    text-decoration: underline;
}

.success-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.success-screen p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 0.5rem;
    animation: fadeIn ease-in-out 0.4s;
}

.success-screen .checkmark {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #4bb71b;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #4bb71b;
    animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
    position: relative;
    top: 5px;
    right: 5px;
    opacity: 0.8;
    margin-bottom: 2rem;
}
.success-screen .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #4bb71b;
    fill: transparent;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.success-screen .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}
</style>
