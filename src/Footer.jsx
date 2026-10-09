function Footer(props) {
    return (
        <footer className="footer">
            <div className="footerbox">
                <h3 className="footer_title">About Web Application</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit perspiciatis eum earum corrupti unde exercitationem magnam fuga nostrum, facilis voluptatum.</p>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto provident nisi nulla, neque iste vitae aut voluptatem impedit libero rerum quam? Deleniti ipsum ratione, libero non architecto necessitatibus doloremque, harum amet aperiam deserunt quam nesciunt.</p>
            </div>
            <div className="footerbox">
                <h3 className="footer_title">Quick Links</h3>
                <ul>
                    <li><a href="/About">About</a></li>
                    <li><a href="/Services">Services</a></li>
                    <li><a href="/Blog">Blog</a></li>
                    <li><a href="/Contact">Contact</a></li>
                </ul>
            </div>
            <div className="footerbox">
                <h3 className="footer_title">Stay Connected With Us.</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                <div className="emailfooter">
                    <input type="email" className="emailfield" id="email"></input>
                    <button type="submit" className="submit">Submit</button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;