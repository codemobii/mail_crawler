import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Input,
  InputWrapper,
  Loader,
  LoadingOverlay,
  Space,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Mailer() {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [response, setResponse] = useState("");
  const [sentToEmails, setSentToEmails] = useState(0);

  const handleSubmit = async () => {
    const size = 1;
    const emails = email.split(",").map((email) => email.trim());

    setSentToEmails(emails.length);

    const res = emails.reduce((acc, curr, i) => {
      if (!(i % size)) {
        acc.push(emails.slice(i, i + size));
      }
      return acc;
    }, []);

    if (email.length === 0) {
      setResponse({
        status: "error",
        message: "Please enter an email address",
      });
      setSent(true);
    } else if (message.length === 0) {
      setResponse({ status: "error", message: "Please enter a message" });
      setSent(true);
    } else if (subject.length === 0) {
      setResponse({ status: "error", message: "Please enter a subject" });
      setSent(true);
    } else {
      setLoading(true);

      res.forEach(async (emails_address, index) => {
        await axios
          .post(`https://epact-api.herokuapp.com/emails`, {
            email: emails_address.join(","),
            message,
            subject,
          })
          .then((res) => {})
          .catch((er) => {
            setResponse({ status: "error", message: "An error occured" });
            setSent(true);
          });

        if (index === res.length - 1) {
          setTimeout(() => {
            setLoading(false);

            setSent(true);
            setResponse({
              status: "success",
              message: "Email sent successfully",
            });
            setSentToEmails(0);
            setMessage("");
            setEmail("");
            setSubject("");
          }, 5000);
        }
      });
    }
  };

  useEffect(() => {
    const handleRemove = setTimeout(() => {
      setSent(false);
      setResponse("");
    }, 2000);

    return () => {
      clearTimeout(handleRemove);
    };
  }, [sent]);

  return (
    <Center style={{ minHeight: "100vh", padding: "20px 0" }}>
      <Container size={"md"} padding={"20px"}>
        <Title>Mail Crawler</Title>

        <Space h="md" />

        {sent && (
          <Alert
            title={response?.message}
            color={response?.status === "error" ? "red" : "teal"}
          />
        )}

        <Box style={{ position: "relative" }}>
          <LoadingOverlay
            visible={loading}
            loader={
              <Center>
                <div>
                  <Center>
                    <Loader />
                  </Center>
                  <Space h="xs" />
                  <Text>Sending message to {sentToEmails} email(s)</Text>
                </div>
              </Center>
            }
          />
          <InputWrapper
            required
            label="Subject"
            description="The subject of the email"
          >
            <Input
              id="input-demo"
              placeholder="Welcome to Mail Crawler"
              value={subject}
              onChange={(e) => setSubject(e.currentTarget.value)}
            />
          </InputWrapper>

          <Space h="sm" />

          <InputWrapper
            required
            label="Email address"
            description="Please enter all email addresses with a comma separated list"
          >
            <Input
              id="input-demo"
              placeholder="email@gmail.com, another@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </InputWrapper>

          <Space h="sm" />

          <InputWrapper
            required
            label="Message"
            description="Enter your message here. you can add color and links"
          >
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
            />
          </InputWrapper>
        </Box>

        <Space h="lg" />

        <Button onClick={handleSubmit} disabled={loading} size="lg">
          Send Request
        </Button>
      </Container>
    </Center>
  );
}
