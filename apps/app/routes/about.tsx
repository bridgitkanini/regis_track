import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page for RegisTrack.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}