import React, { useEffect, useState } from 'react'
import { DNA } from 'react-loader-spinner';
import { Formik } from 'formik';
import { Checkbox } from 'antd';
import axios from 'axios';
import { MdCopyright } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';
import OtpInput from 'react-otp-input';

const ProviderLogin = () => {

    const navigate = useNavigate();
    const [loginErr, setLoginErr] = useState(false);
    const [showForgotEmail, setShowForgotEmail] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(true);

    const [showOTPForm, setShowOTPForm] = useState(false);

    function sleep(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms)
        })
    }


    async function handleLogin(values, setSubmitting) {
        try {
            await sleep(2000);
            const response = await axios.post("https://augurex.newdaydiagnostics.com/api/v1/manage/provider-login", { ...values });
            if (response.status === 200) {
                localStorage.setItem("colo_H_accessToken", response.data.data.accessToken);
                localStorage.setItem("colo_H_providerData", JSON.stringify(response.data.data));

                // redirect to provider portal 
                navigate("/provider-portal");
            } else {
                setLoginErr(true);
            }
            setSubmitting(false);
        } catch (error) {
            console.log(error);
            setSubmitting(false);
            setLoginErr(true);
        }
    }

    useEffect(() => {
        if (localStorage.getItem('colo_H_accessToken') && Object.keys(JSON.parse(localStorage.getItem('colo_H_providerData'))).length > 0) {
            navigate("/provider-portal")
        }
    }, [])
    function showEmailForm() {
        setShowForgotEmail(true);
        setShowLoginForm(false);
        setShowOTPForm(false);

    }
    async function handleSendEmail(values, setSubmitting) {
        try {

            // const response = await axios.post("augurex.newdaydiagnostics.com/send-otp", values);

            if (200) {
                setShowForgotEmail(false);
                setShowLoginForm(false);
                setShowOTPForm(true);
            }
            setSubmitting(false);
        }
        catch (error) {
            setShowForgotEmail(true);
            setShowLoginForm(false);
            setShowOTPForm(false);
            setSubmitting(false);

        }
    }

    async function forgotPassword(values, setSubmitting) {
        try {

            const response = await axios.post("augurex.newdaydiagnostics.com/send-otp", values)

            if (response.status === 200) {
                setShowForgotEmail(false);
                setShowLoginForm(true);
                setShowOTPForm(false);
            }
            setSubmitting(false);
        }
        catch (error) {

            setShowForgotEmail(false);
            setShowLoginForm(false);
            setShowOTPForm(true);

            setSubmitting(false);
        }
    }

    return (
        <section className='login-pattern-bg min-h-screen flex items-center justify-center'>
            <div className='flex items-stretch 980:w-[72%] 1200:w-[60%] 1368:w-[55%] 1500:w-[52%] 320:w-full 320:flex-col 980:flex-row  '>
                <div className='bg-login-sidepattern flex 980:w-[45%] 320:w-full items-center flex-col justify-center 320:py-[10px] py-[100px]  border-[1px] border-[rgba(0,0,0,0.1)] shadow-[1px_1px_12px_1px_rgba(0,0,0,0.1)]'>
                    <figure className=' gap-[10px] login-pg-logo-wr flex flex-col items-center justify-center w-full '>
                        <img onClick={() => navigate("/")} className='cursor-pointer' src="/NewDayLogo_FINAL.png" width={250} alt="" />
                    </figure>
                    <p className='ysabeau text-[25px]'>Provider Portal</p>
                </div>
                <div id="login-bg" className='980:w-[55%] 320:w-full flex flex-col items-start justify-start center-wr bg-white pt-[30px] px-[30px] relative 320:max-w-full '>

                    {
                        showForgotEmail && !showLoginForm && !showOTPForm ?
                            (
                                <div>
                                    <Formik
                                    key={"emaiForm"}
                                        initialValues={{ email: '' }}
                                        validate={values => {
                                            const errors = {};
                                            if (!values.email) {
                                                errors.email = 'Email is Required';
                                            } else if (
                                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                            ) {
                                                errors.email = 'Invalid email address';
                                            }

                                            return errors;
                                        }}
                                        onSubmit={(values, { setSubmitting }) => {
                                            setTimeout(() => {
                                                handleSendEmail(values, setSubmitting);
                                            }, 400);
                                        }}
                                    >
                                        {
                                            ({
                                                values,
                                                errors,
                                                touched,
                                                handleChange,
                                                handleBlur,
                                                handleSubmit,
                                                isSubmitting,
                                                setFieldValue,
                                            }) => (
                                                <form onSubmit={handleSubmit} className='w-[100%] provider-login-form-wr'>
                                                    {
                                                        loginErr && <p className='mt-[10px] text-[14px] 320:w-full w-[30%] p-[10px] bg-rose-50 border-[1px] border-rose-400 text-rose-600'>
                                                            Email and / or password incorrect! Please try again
                                                        </p>
                                                    }
                                                    <div className='w-[100%] mt-[20px]'>
                                                        <label className=' block relative text-slate-600 mb-[5px]' htmlFor="">Email {(errors.email && touched.email) && <span className='font-medium ml-[10px] absolute right-0 text-[14px] text-rose-600'>{errors.email}</span>}</label>
                                                        <input name='email' value={values.email} onChange={handleChange} onBlur={handleBlur} type="text" className='border-[1px] w-[100%] shadow-sm bg-slate-100  px-[30px] py-[8.5px]' />
                                                    </div>


                                                    <div className="" >	<button className='block px-[30px] mt-[15px] text-[16px] leading-[48px] font-semibold bg-gradient-to-br from-[#392381] to-[#392381] text-white '>{isSubmitting ?
                                                        <DNA
                                                            visible={true}
                                                            height="50"
                                                            width="45"
                                                            ariaLabel="dna-loading"
                                                            wrapperStyle={{}}
                                                            wrapperClass="dna-wrapper"
                                                        /> : 'Submit'}</button>  </div>
                                                </form>
                                            )
                                        }
                                    </Formik>

                                </div>
                            )

                            : (
                                !showForgotEmail && !showLoginForm && showOTPForm &&
                                <div>

                                    <Formik
                                    key={"OTP_Form"}
                                        initialValues={{ otp: '', password: '', confirmPassword: '' }}
                                        validate={values => {
                                            const errors = {};
                                            if (!values.otp) {
                                                errors.otp = 'OTP is Required';
                                            } else if (
                                                !values.password
                                            ) {
                                                errors.password = 'Password Required';
                                            }

                                            else if (!values.confirmPassword) errors.confirmPassword = " Required";
                                            else if (values.password !== values.confirmPassword) errors.passwordNotMatch = "Password not match"
                                            return errors;
                                        }}
                                        onSubmit={(values, { setSubmitting }) => {
                                            setTimeout(() => {
                                                forgotPassword(values, setSubmitting);
                                            }, 400);
                                        }}
                                    >
                                        {
                                            ({
                                                values,
                                                errors,
                                                touched,
                                               handleChange,
                                                handleBlur,
                                                handleSubmit,
                                                isSubmitting,
                                                setFieldValue,
                                            }) => (
                                                <form onSubmit={handleSubmit} className='w-[100%] provider-login-form-wr'>
                                                    {
                                                        errors && errors.passwordNotMatch && <p className='mt-[10px] text-[14px] 320:w-full w-[30%] p-[10px] bg-rose-50 border-[1px] border-rose-400 text-rose-600'>
                                                            {errors.passwordNotMatch}
                                                        </p>
                                                    }

                                                    <div className='w-[100%] mt-[20px]'>
                                                        <label className=' block relative text-slate-600 mb-[5px] mt-[30px]' htmlFor="">Password {(errors.password && touched.password) && <span className='font-medium ml-[10px] absolute right-0 text-[14px] text-rose-600'>{errors.password}</span>}</label>
                                                        <input name='password' value={values.password} onChange={handleChange} onBlur={handleBlur} type="text" className='border-[1px] w-[100%] shadow-sm bg-slate-100  px-[30px] py-[8.5px]' />
                                                        {/* <p className='text-right underline text-sky-600'>Forgot Password?</p> */}
                                                    </div>
                                                    <div className='w-[100%] mt-[20px]'>
                                                        <label className=' block relative text-slate-600 mb-[5px] mt-[30px]' htmlFor=""> Confirm Password {(errors.confirmPassword && touched.confirmPassword) && <span className='font-medium ml-[10px] absolute right-0 text-[14px] text-rose-600'>{errors.confirmPassword}</span>}</label>
                                                        <input name='confirmPassword' value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} type="password" className='border-[1px] w-[100%] shadow-sm bg-slate-100  px-[30px] py-[8.5px]' />
                                                        {/* <p className='text-right underline text-sky-600'>Forgot Password?</p> */}
                                                    </div>
                                                    <div className='w-[100%] mt-[20px]'>
                                                        <label className=' block relative text-slate-600 mb-[5px] mt-[30px]' htmlFor=""> OTP {(errors.otp && touched.otp) && <span className='font-medium ml-[10px] absolute right-0 text-[14px] text-rose-600'>{errors.confirmPassword}</span>}</label>
                                                        <OtpInput

                                                            value={values.otp}
                                                            onChange={(otp) => { setFieldValue("otp",otp) }}
                                                            numInputs={4}
                                                            renderSeparator={<span className='inline-block'>-</span>}
                                                            inputStyle={{ height: "55px", width: "55px", border: "1px solid #484848",  backgroundColor: "#f1f5f9" }}
                                                            containerStyle={{ display: "flex", alignItems: "center", gap: "12px" }}
                                                            renderInput={(props) => <input  {...props} />}
                                                        />
                                                        {/* <p className='text-right underline text-sky-600'>Forgot Password?</p> */}
                                                    </div>

                                                    <div className="flex justify-between items-center" >	<button className='block px-[30px] mt-[15px] text-[16px] leading-[48px] font-semibold bg-gradient-to-br from-[#392381] to-[#392381] text-white '>{isSubmitting ?
                                                        <DNA
                                                            visible={true}
                                                            height="50"
                                                            width="45"
                                                            ariaLabel="dna-loading"
                                                            wrapperStyle={{}}
                                                            wrapperClass="dna-wrapper"
                                                        /> : 'Submit'}</button>  </div>
                                                </form>
                                            )
                                        }
                                    </Formik>



                                </div>
                            )
                    }
                    {
                        showLoginForm && !showOTPForm && !showForgotEmail &&
                        <div>
                            <h2 className='mt-[24px] 320:mt-[0px] w-full text-left text-[22px] provider-login-form-wr'>Login</h2>

                            <Formik
                            key={"Login_Form"}
                                initialValues={{ email: '', password: '', rememberMe: false }}
                                validate={values => {
                                    const errors = {};
                                    if (!values.email) {
                                        errors.email = 'Email is Required';
                                    } else if (
                                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                    ) {
                                        errors.email = 'Invalid email address';
                                    }
                                    if (!values.password) errors.password = " Required"
                                    return errors;
                                }}
                                onSubmit={(values, { setSubmitting }) => {
                                    setTimeout(() => {
                                        handleLogin(values, setSubmitting);
                                    }, 400);
                                }}
                            >
                                {
                                    ({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        isSubmitting,
                                        setFieldValue,
                                    }) => (
                                        <form onSubmit={handleSubmit} className='w-[100%] provider-login-form-wr'>
                                            {
                                                loginErr && <p className='mt-[10px] text-[14px] 320:w-full w-[30%] p-[10px] bg-rose-50 border-[1px] border-rose-400 text-rose-600'>
                                                    Email and / or password incorrect! Please try again
                                                </p>
                                            }
                                            <div className='w-[100%] mt-[20px]'>
                                                <label className=' block relative text-slate-600 mb-[5px]' htmlFor="">Email {(errors.email && touched.email) && <span className='font-medium ml-[10px] absolute right-0 text-[14px] text-rose-600'>{errors.email}</span>}</label>
                                                <input name='email' value={values.email} onChange={handleChange} onBlur={handleBlur} type="text" className='border-[1px] w-[100%] shadow-sm bg-slate-100  px-[30px] py-[8.5px]' />
                                            </div>
                                            <div className='w-[100%] mt-[20px]'>
                                                <label className=' block relative text-slate-600 mb-[5px] mt-[30px]' htmlFor="">Password {(errors.password && touched.password) && <span className='font-medium ml-[10px] absolute right-0 text-[14px] text-rose-600'>{errors.password}</span>}</label>
                                                <input name='password' value={values.password} onChange={handleChange} onBlur={handleBlur} type="password" className='border-[1px] w-[100%] shadow-sm bg-slate-100  px-[30px] py-[8.5px]' />
                                                {/* <p className='text-right underline text-sky-600'>Forgot Password?</p> */}
                                            </div>
                                            <div className='text-right mt-[6px]'><Checkbox name='rememberMe' value={values.rememberMe} onChange={handleChange} >Remember Me</Checkbox></div>
                                            <div className="flex justify-between items-center" >	<button className='block px-[30px] mt-[15px] text-[16px] leading-[48px] font-semibold bg-gradient-to-br from-[#392381] to-[#392381] text-white '>{isSubmitting ?
                                                <DNA
                                                    visible={true}
                                                    height="50"
                                                    width="45"
                                                    ariaLabel="dna-loading"
                                                    wrapperStyle={{}}
                                                    wrapperClass="dna-wrapper"
                                                /> : 'Log In'}</button> <p className="cursor-pointer hover:text-sky-500   " onClick={() => { showEmailForm() }} >Forgot Password </p> </div>
                                        </form>
                                    )
                                }
                            </Formik>
                        </div>

                    }
                    <div className='py-[10px] w-full mt-[10px] mb-[10px] ysabeau text-center font-[500]'>Need an account? <a className=' ml-[5px] font-[500] text-[#0C1F8F] text-[14px]' href="https://newdaydiagnostics.com/augurexportal-signup">Click Here to sign up</a></div>
                    <div className='w-full border-t-[1px] border-t-[rgba(0,0,0,0.1)] flex flex-col items-center justify-center pb-[12px]'>
                        <div className='flex items-center gap-[5px] text-center 320:text-[12px] mt-[10px] text-slate-500 mx-auto my-0'><p className='text-center'>Copyright {new Date().getFullYear()}, <Link to="/">NewDay Diagnostics</Link>. All Rights Reserved.</p></div>
                        <p className='mt-[0px] text-center text-slate-500 320:text-[12px]'>For permissions requests or other inquiries, please contact <Link to="/">NewDay Diagnostics</Link>.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProviderLogin;
