import {compositionDataCreatePost} from "./Login.jsx"
import Login from "./Login.jsx"
import PostsView from "./postView.jsx";
import { render, screen } from '@testing-library/react';

const f = new File([""], "filename", { type: 'image/jpeg' });

test("compositionDataCreatePost",()=>{
    expect(compositionDataCreatePost("POST",f,"testitle") instanceof FormData).toBe(true);
    expect(compositionDataCreatePost("POST",f,"testitle").has('image')).toBe(true);
    expect(compositionDataCreatePost("POST",f,"testitle").has('title')).toBe(true);
    expect(compositionDataCreatePost("GET",f,"testitle") instanceof FormData).toBe(false);
})
test('renders Login Module', () => {
    render(<Login />);
    const mainScreenElement = screen.getByText(/Login or Register/i);
    expect(mainScreenElement).toBeInTheDocument();
  });

const posts=[{title: "test1", image: "https://ibb.co/4s0VqrB"},{title: "test2", image: "https://ibb.co/4s0VqrB"},{title: "test3", image: "https://ibb.co/4s0VqrB"}]

test('renders postView Module', () => {
    render(<PostsView posts={posts}/>);
    const mainScreenElement2 = screen.getByText(/test1/i);
    const mainScreenElement3 = screen.getByText(/test2/i);
    const mainScreenElement4 = screen.getByText(/test3/i);
    expect(mainScreenElement2).toBeInTheDocument();
    expect(mainScreenElement3).toBeInTheDocument();
    expect(mainScreenElement4).toBeInTheDocument();
  });