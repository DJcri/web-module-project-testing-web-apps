import React from "react";
import { findByTestId, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

test("renders without errors", () => {
  render(<ContactForm />);
});

test("renders the contact form header", () => {
  render(<ContactForm />);
  const h1 = screen.queryByText("Contact Form");
  expect(h1).toBeInTheDocument();
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.queryByLabelText("First Name*");

  userEvent.type(firstNameInput, "four");
  const errorMessage = await screen.findByTestId("error");

  expect(errorMessage).toBeInTheDocument();
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.queryByLabelText("First Name*");
  const lastNameInput = screen.queryByLabelText("Last Name*");
  const emailInput = screen.queryByLabelText("Email*");

  userEvent.type(firstNameInput, "a");
  userEvent.type(lastNameInput, "a");
  userEvent.type(emailInput, "a");
  userEvent.clear(firstNameInput);
  userEvent.clear(lastNameInput);
  userEvent.clear(emailInput);

  const errorMessages = await screen.findAllByTestId("error");
  expect(errorMessages.length).toBeGreaterThanOrEqual(2);
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  render(<ContactForm />);
  const firstNameInput = screen.queryByLabelText("First Name*");
  const emailInput = screen.queryByLabelText("Email*");

  userEvent.type(firstNameInput, "fiver");
  userEvent.type(emailInput, "a");
  userEvent.clear(emailInput);

  const errorMessage = await screen.findByTestId("error");
  expect(errorMessage).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />);
  const emailInput = screen.queryByLabelText("Email*");

  userEvent.type(emailInput, "invalid email");

  const errorMessage = await screen.findByText(
    /email must be a valid email address/i
  );
  expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />);
  const submitBtn = screen.queryByRole("button", { name: /submit/i });
  const lastNameInput = screen.queryByLabelText("Last Name*");

  userEvent.clear(lastNameInput);
  submitBtn.click();

  const errorMessage = await screen.findByText(/lastName is a required field/i);
  expect(errorMessage).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  render(<ContactForm />);
  const submitBtn = screen.queryByRole("button", { name: /submit/i });
  const firstNameInput = screen.queryByLabelText("First Name*");
  const lastNameInput = screen.queryByLabelText("Last Name*");
  const emailInput = screen.queryByLabelText("Email*");
  const messageInput = screen.queryByLabelText("Message");

  userEvent.type(firstNameInput, "Eddie");
  userEvent.type(lastNameInput, "Burke");
  userEvent.type(emailInput, "eddburke@email.com");
  userEvent.clear(messageInput);
  submitBtn.click();

  const firstNameDisplay = await screen.findByTestId("firstnameDisplay");
  const lastNameDisplay = await screen.findByTestId("lastnameDisplay");
  const emailDisplay = await screen.findByTestId("emailDisplay");
  const messageDisplay = screen.queryByTestId("messageDisplay");

  expect(firstNameDisplay).toBeInTheDocument();
  expect(lastNameDisplay).toBeInTheDocument();
  expect(emailDisplay).toBeInTheDocument();
  expect(messageDisplay).toBeNull();
});

test("renders all fields text when all fields are submitted.", async () => {
  render(<ContactForm />);
  const submitBtn = screen.queryByRole("button", { name: /submit/i });
  const firstNameInput = screen.queryByLabelText("First Name*");
  const lastNameInput = screen.queryByLabelText("Last Name*");
  const emailInput = screen.queryByLabelText("Email*");
  const messageInput = screen.queryByLabelText("Message");

  userEvent.type(firstNameInput, "Eddie");
  userEvent.type(lastNameInput, "Burke");
  userEvent.type(emailInput, "eddburke@email.com");
  userEvent.type(messageInput, "hello");
  submitBtn.click();

  const firstNameDisplay = await screen.findByTestId("firstnameDisplay");
  const lastNameDisplay = await screen.findByTestId("lastnameDisplay");
  const emailDisplay = await screen.findByTestId("emailDisplay");
  const messageDisplay = await screen.findByTestId("messageDisplay");

  expect(firstNameDisplay).toBeInTheDocument();
  expect(lastNameDisplay).toBeInTheDocument();
  expect(emailDisplay).toBeInTheDocument();
  expect(messageDisplay).toBeInTheDocument();
});
