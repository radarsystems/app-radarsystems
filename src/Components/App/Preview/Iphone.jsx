import { Icon } from "@iconify/react";
import "./iphone.css"

export default function PreviewIphone() {
    return (
        <div className="iphone" style={{ background: `url(img/devices/iphone.png)` }}>
            <div className="top">
                <div className="hour">
                    <span>12:45</span>
                </div>

                <div className="battery">
                    <span className="signal">
                        <i><Icon icon="oi:signal" /></i>
                        <span>LTE</span>
                    </span>

                    <i className="battery">
                        <Icon icon="ph:battery-high-fill" />
                    </i>


                </div>

                <div className="content">
                    <div class="editor-surveys prodbuttonsqr">
                    </div>
                </div>
            </div>
        </div>
    );
}
