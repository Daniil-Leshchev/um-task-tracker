
import '../styles/Avatar.css';

const Avatar = ({ name, initials, color, size = 32 }) => {
    return (
        <div
        className="avatar"
        style={{
            width: size,
            height: size,
            backgroundColor: color
        }}
        title={name}
        >
        {initials}
        </div>
    );
};

export default Avatar;
