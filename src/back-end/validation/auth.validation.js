import * as bodyV from "./body.validation.js";

export const authValidate = {
  login: () => {
    return [
      bodyV.email("email", 255, true, "Email"),
      bodyV.string("password", 255, true, null, "Password")
    ];
  }
};