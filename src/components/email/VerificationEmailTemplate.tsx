import { Body, Container, Head, Heading, Html } from '@react-email/components';

interface VerificationEmailProps {
  verificationCode: string;
}

const VerificationEmail = ({ verificationCode }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Body
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        padding: '20px',
        margin: '0',
      }}
    >
      <Container
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            padding: '20px 40px',
            backgroundColor: '#000000',
            color: '#ffffff',
            textAlign: 'center',
            borderRadius: '8px 8px 0 0',
          }}
        >
          <Heading style={{ fontSize: '24px', margin: '0', color: '#ffffff' }}>
            Welcome to PrimeTech!
          </Heading>
        </div>

        <div style={{ padding: '40px' }}>
          <h2
            style={{ fontSize: '22px', color: '#333333', marginBottom: '20px' }}
          >
            Verify Your Email
          </h2>
          <p style={{ fontSize: '16px', color: '#555555' }}>
            Thanks for registering! Please verify your email address by using
            the verification code below:
          </p>

          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <p
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#000000',
                letterSpacing: '4px',
              }}
            >
              {verificationCode}
            </p>
          </div>

          <p style={{ fontSize: '16px', color: '#555555' }}>
            If you did not request this verification, you can safely ignore this
            email.
          </p>
        </div>

        <div
          style={{
            padding: '20px 40px',
            backgroundColor: '#f4f4f4',
            textAlign: 'center',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <p style={{ fontSize: '14px', color: '#999999' }}>
            Sent from PrimeTech Blog | © {new Date().getFullYear()} PrimeTech
            Blog
          </p>
        </div>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;
