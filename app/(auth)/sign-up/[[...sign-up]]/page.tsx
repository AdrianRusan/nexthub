import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
  return (
    <main className='flex h-screen w-full items-center justify-center'>
      <div data-testid="sign-up">
        <SignUp />
      </div>
    </main>
  )
}

export default SignUpPage