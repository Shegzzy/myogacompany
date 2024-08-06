import { Button, Modal } from "react-bootstrap";
import "./terms.scss";

const TermsModal = ({ isOpen, onClose, onAgree, isLoading }) => {

    return (
      <Modal
        show={isOpen}
        onHide={onClose}
        backdrop="static"
        contentLabel="Terms and Conditions"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Modal.Body>
            <h2>Terms and Conditions</h2>
            <div className="terms-content">
            <p><strong>AGREEMENT AND TERMS AND CONDITIONS</strong></p>
            <p>
            This Agreement (hereinafter referred to as the "Agreement") is made and
            entered into as of the date of acceptance of these Terms and Conditions, by
            and between:
            </p>
            <p>
            <strong>My Oga Technologies</strong> (hereinafter referred to as "My Oga"), a company duly
            incorporated and existing under the laws of Nigeria, with its principal office
            located at [Address],
            </p>
            <p>and</p>
            <p>
            <strong>[Logistic Company Name]</strong> (hereinafter referred to as the "Company"), a
            company duly incorporated and existing under the laws of Nigeria, with its
            principal office located at [Address].
            </p>
            <p>
            Collectively referred to as the "Parties" and individually as a "Party".
            </p>
            <p><strong>WHEREAS:</strong></p>
            <p>
            1. My Oga provides an innovative logistics aggregator platform that
            connects SMEs and individual users with logistics companies;
            </p>
            <p>
            2. The Company desires to utilize the My Oga platform to receive and
            manage delivery requests;
            </p>
            <p>
            <strong>NOW, THEREFORE</strong>, in consideration of the mutual covenants and promises
            herein contained, and for other good and valuable consideration, the receipt
            and sufficiency of which are hereby acknowledged, the Parties agree as
            follows:
            </p>
            <p><strong>1. Services Provided</strong></p>
            <p>
            1.1 My Oga shall provide the Company with access to its platform for the
            purpose of receiving and managing delivery requests.
            </p>
            <p>
            1.2 The Company agrees to utilize the My Oga platform exclusively for its
            logistics operations during the term of this Agreement.
            </p>
            <p><strong>2. Commission and Payment Terms</strong></p>
            <p>
            2.1 The Company shall pay My Oga a commission of fifteen percent (15%) on
            all trips booked through the My Oga platform.
            </p>
            <p>
            2.2 My Oga reserves the right to increase the commission fee with thirty (30)
            days prior written notice to the Company.
            </p>
            <p>
            2.3 Payments shall be made every Monday morning for the preceding week's
            transactions to the account number provided by My Oga Technologies.
            </p>
            <p>
            2.4 Failure to make the required payments will result in an immediate
            suspension of the Company’s account, thereby preventing riders from
            accessing their rider apps until payment is confirmed.
            </p>
            <p><strong>3. Responsibilities of the Company</strong></p>
            <p>
            3.1 The Company shall ensure that all riders comply with the guidelines and
            policies set forth by My Oga.
            </p>
            <p>
            3.2 The Company shall be responsible for the conduct and performance of its
            riders.
            </p>
            <p>
            3.3 The Company shall not engage in, develop, or launch any project or
            application similar to My Oga during the term of this Agreement and for a
            period of four (4) years following the termination of this Agreement.
            </p>
            <p><strong>4. Legal Protection and Indemnification</strong></p>
            <p>
            4.1 My Oga shall not be liable for any damages, losses, or claims arising from
            the Company’s use of the My Oga platform.
            </p>
            <p>
            4.2 The Company agrees to indemnify, defend, and hold harmless My Oga
            from any and all claims, damages, liabilities, costs, and expenses (including
            reasonable attorneys' fees) arising out of or related to the Company’s
            operations or the conduct of its riders.
            </p>
            <p><strong>5. Term and Termination</strong></p>
            <p>
            5.1 This Agreement shall commence on the date of acceptance of these Terms
            and Conditions and shall continue until terminated by either Party in
            accordance with this Agreement.
            </p>
            <p>
            5.2 Either Party may terminate this Agreement by providing thirty (30) days
            prior written notice to the other Party.
            </p>
            <p>
            5.3 My Oga may terminate this Agreement immediately if the Company fails
            to make the required payments or breaches any terms of this Agreement.
            </p>
            <p>
            5.4 Upon termination, the Company shall cease all use of the My Oga
            platform and settle any outstanding payments within ten (10) business days.
            </p>
            <p><strong>6. Confidentiality</strong></p>
            <p>
            6.1 The Parties agree to maintain the confidentiality of all information
            obtained in connection with this Agreement and not to disclose such
            information to any third party without prior written consent.
            </p>
            <p><strong>7. Governing Law and Dispute Resolution</strong></p>
            <p>
            7.1 This Agreement shall be governed by and construed in accordance with
            the laws of Nigeria.
            </p>
            <p>
            7.2 Any disputes arising out of or in connection with this Agreement shall be
            resolved through good faith negotiations. If the Parties are unable to resolve
            the dispute within thirty (30) days, the dispute shall be referred to and finally
            resolved by arbitration in accordance with the rules of the Nigerian Arbitration
            and Conciliation Act.
            </p>
            <p><strong>8. Miscellaneous</strong></p>
            <p>
            8.1 This Agreement constitutes the entire agreement between the Parties and
            supersedes all prior agreements and understandings, whether written or oral,
            relating to the subject matter hereof.
            </p>
            <p>
            8.2 Any amendment or modification of this Agreement must be in writing and
            signed by both Parties.
            </p>
            <p>
            8.3 The failure of either Party to enforce any provision of this Agreement shall
            not constitute a waiver of such provision or any other provision.
            </p>
            <p>
            8.4 If any provision of this Agreement is held to be invalid or unenforceable,
            the remaining provisions shall continue in full force and effect.
            </p>
            <p><strong>9. Additional Provisions</strong></p>
            <p>
            9.1 The Company acknowledges that My Oga may introduce new features or
            services on the platform which may be subject to additional fees.
            </p>
            <p>
            9.2 My Oga will communicate any such fees to the Company with thirty (30)
            days prior written notice.
            </p>
            <p>
            By accepting these Terms and Conditions, the Company acknowledges that it
            has read, understood, and agrees to be bound by this Agreement. The
            acceptance of these Terms and Conditions, together with the timestamp of
            acceptance, shall constitute the effective date of this Agreement.
            </p>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
                Close
            </Button>
            <Button variant="primary" onClick={onAgree} disabled={isLoading}>
                I Agree
            </Button>
        </Modal.Footer>
        
      </Modal>
    );
  };
  
  export default TermsModal;