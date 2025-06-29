import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
  return (
    <main className='flex h-screen w-full items-center justify-center'>
      <div data-testid="sign-in">
        <SignIn />
      </div>
    </main>
  )
}

export default SignInPage