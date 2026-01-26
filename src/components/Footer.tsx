import '../css/Footer.css'

const Footer = () => {
    const year = new Date();
    return (
        <div className='footer'>
            <ul className="li-footer">
                <li>Карта сайта</li>
                <li>Copyright {year.getFullYear()}</li>
                <li>Сотрудничество</li>
            </ul>
        </div>
    )
};

export default Footer;