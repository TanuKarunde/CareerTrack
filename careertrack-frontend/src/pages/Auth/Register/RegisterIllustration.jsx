import boyStanding from '../../../assets/boy-standing.jpeg'

function RegisterIllustration() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-white lg:flex lg:items-center lg:justify-start">

        <div className='relative flex w-[600px] items-center justify-start pl-10'>
            <img
          src={boyStanding}
          alt="Login illustration"
          className="max-h-[100vh] w-auto object-contain"
        />
        </div>
        </div>
  )
}

export default RegisterIllustration