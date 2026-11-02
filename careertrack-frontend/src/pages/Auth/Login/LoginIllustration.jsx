import logingirlImage from '../../../assets/logingirl-image.jpeg'

function LoginIllustration() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-violet-50 lg:flex lg:items-center lg:justify-start">

        <div className='relative flex w-[600px] items-center justify-start pl-10'>
            <img
          src={logingirlImage}
          alt="Login illustration"
          className="max-h-[100vh] w-auto object-contain"
        />
        </div>
        </div>
  )
}

export default LoginIllustration