import React, { useContext } from "react";
import {
    BoldLink,
    BoxContainer,
    FormContainer,
    Input,
    LineText,
    MutedLink,
    SubmitButton,
} from "./common";
import { Marginer } from "./marginer";
import { AccountContext } from './accountContext';

export function SignupForm(props) {

    const { switchToSignin } = useContext(AccountContext);
    return (
        <BoxContainer>
            <FormContainer>
                <Input type="text" placeholder="Company Name" />
                <Input type="email" placeholder="Email" />
                <Input type="password" placeholder="Password" />
                <Input type="date" placeholder="Date of Establishment" />
                <Input type="text" placeholder="Reg. Number" />
                <Input type="text" placeholder="Location" />
                <Input type="text" placeholder="Address" />
                <Input type="text" placeholder="Phone Number" />
                <Input type="text" placeholder="Bank Name" />
                <Input type="number" placeholder="Account Number" />
                <Input type="file" placeholder="Documents" required multiple id="documents" />
            </FormContainer>
            <Marginer direction="vertical" margin={10} />
            <SubmitButton type="submit">Sign Up</SubmitButton>
            <Marginer direction="vertical" margin="5px" />
            <LineText>
                Already have an account?{" "}
                <BoldLink onClick={switchToSignin} href="#">
                    Login
                </BoldLink>
            </LineText>
        </BoxContainer>
    );
}