import { useState, useEffect, FormEvent } from 'react';
import { supabase } from './SupabaseClient';

export function Auth() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormElement<HTMLFormElement>) => {
        e.preventDefault();
        if (isSignUp) {
            const {error: signUpError} = await supabase.auth.signUp({email, password});
            if (signUpError) {
                console.error("Error Signing Up:", signUpError.message);
                return;
            }
        } else {
            const {error: signInError} = await supabase.auth.signInWithPassword({email, password});
            if (signInError) {
                console.error("Error Signing Up:", signInError.message);
                return;
            }
        }
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h1 className="text-primary">{ isSignUp ? "Sign Up" : "Sign In" } Form</h1>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label d-flex">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="pt@gmail.com"
                                            value={email}
                                            onChange={
                                                (e: FormEvent<HTMLFormElement>) => setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label d-flex">Password</label>
                                         <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="*******"
                                            value={password}
                                            onChange={
                                                (e: FormEvent<HTMLFormElement>) => setPassword(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="mb-3 d-flex ‌align-items-center">
                                        <button type="submit" className="btn btn-primary">
                                            { isSignUp ? "Sign Up" : "Sign In" }
                                        </button>
                                        <a href="#" className="mx-2" onClick={() => {setIsSignUp(!isSignUp)}}> 
                                            Click Here For { isSignUp ? "Sign In" : "Sign Up" }
                                        </a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}