import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  EmailShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

export default function ProductShare() {
  return (
    <div className="socialShare">
      <FacebookShareButton url={window.location.href}>
        <FacebookIcon size={38} className="socialShareButton" />
      </FacebookShareButton>
      <FacebookMessengerShareButton url={window.location.href}>
        <FacebookMessengerIcon size={38} className="socialShareButton" />
      </FacebookMessengerShareButton>
      <TwitterShareButton url={window.location.href}>
        <TwitterIcon size={38} className="socialShareButton" />
      </TwitterShareButton>
      <LinkedinShareButton url={window.location.href}>
        <LinkedinIcon size={38} className="socialShareButton" />
      </LinkedinShareButton>
      <RedditShareButton url={window.location.href}>
        <RedditIcon size={38} className="socialShareButton" />
      </RedditShareButton>
      <TelegramShareButton url={window.location.href}>
        <TelegramIcon size={38} className="socialShareButton" />
      </TelegramShareButton>
      <WhatsappShareButton url={window.location.href}>
        <WhatsappIcon size={38} className="socialShareButton" />
      </WhatsappShareButton>
      <PinterestShareButton url={window.location.href}>
        <PinterestIcon size={38} className="socialShareButton " />
      </PinterestShareButton>
      <EmailShareButton url={window.location.href}>
        <EmailIcon size={38} className="socialShareButton" />
      </EmailShareButton>
    </div>
  );
}
