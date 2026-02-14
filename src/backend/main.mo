import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  type Customer = {
    name : Text;
    mobile : Text;
    aadhar : Text;
    pan : Text;
    referral : Text;
    address : Text;
    remarks : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  public type CustomerRequest = {
    id : Text;
    customerId : Text;
    message : Text;
    timestamp : Int;
  };

  type Loan = {
    id : Text;
    customerId : Text;
    amount : Float;
    interestRate : Float;
    termMonths : Int;
    emiAmount : Float;
    startDate : Int;
    status : LoanStatus;
    emiSchedule : [EMI];
    paidEmis : Int;
    balanceDue : Float;
    totalInterest : Float;
    principalRemaining : Float;
  };

  public type LoanStatus = {
    #active;
    #closed;
    #delinquent;
  };

  public type EMI = {
    dueDate : Int;
    amount : Float;
    paid : Bool;
    paidDate : ?Int;
    balanceAfterPayment : Float;
  };

  let customers = Map.empty<Text, Customer>();
  let loans = Map.empty<Text, Loan>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let accessControlState = AccessControl.initState();
  let customerRequests = Map.empty<Text, CustomerRequest>();
  include MixinAuthorization(accessControlState);

  // Customer Management
  public shared ({ caller }) func addCustomer(name : Text, mobile : Text, aadhar : Text, pan : Text, referral : Text, address : Text, remarks : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add customers");
    };

    let customer : Customer = {
      name;
      mobile;
      aadhar;
      pan;
      referral;
      address;
      remarks;
    };

    customers.add(name, customer);
  };

  public query ({ caller }) func getCustomer(name : Text) : async ?Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view customers");
    };
    customers.get(name);
  };

  public query ({ caller }) func getAllCustomers() : async [Customer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view customers");
    };
    customers.values().toArray();
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func requestCustomer(name : Text, message : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request customers");
    };
    let requestId = name.concat("request");
    let customerRequest : CustomerRequest = {
      id = requestId;
      customerId = name;
      message;
      timestamp = 0;
    };
    customerRequests.add(requestId, customerRequest);
    requestId;
  };

  // Loan Management
  public shared ({ caller }) func createLoan(customerId : Text, amount : Float, interestRate : Float, termMonths : Int) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create loans");
    };

    let startDate = Time.now();
    let emiAmount = calculateEMI(amount, interestRate, termMonths);
    let loanId = customerId.concat("loan").concat(startDate.toText());

    let loan : Loan = {
      id = loanId;
      customerId;
      amount;
      interestRate;
      termMonths;
      emiAmount;
      startDate;
      status = #active;
      emiSchedule = [];
      paidEmis = 0;
      balanceDue = amount;
      totalInterest = 0.0;
      principalRemaining = amount;
    };

    loans.add(loanId, loan);
    loanId;
  };

  public query ({ caller }) func getLoan(loanId : Text) : async ?Loan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loans");
    };
    loans.get(loanId);
  };

  public query ({ caller }) func getLoansForCustomer(customerId : Text) : async [Loan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loans");
    };
    let filtered = loans.values().toArray().filter(
      func(loan) { loan.customerId == customerId }
    );
    filtered;
  };

  public shared ({ caller }) func closeLoan(loanId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can close loans");
    };

    switch (loans.get(loanId)) {
      case (null) { Runtime.trap("Loan not found") };
      case (?loan) {
        let updatedLoan = { loan with status = #closed };
        loans.add(loanId, updatedLoan);
      };
    };
  };

  public shared ({ caller }) func recordPayment(loanId : Text, paidDate : Int) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can record payments");
    };

    let loan = loans.get(loanId);
    switch (loan) {
      case (null) { Runtime.trap("Loan not found") };
      case (?loan) {
        switch (loan.status) {
          case (#closed) {
            Runtime.trap("Loan is already closed");
          };
          case (#active) {
            let updatedPaymentCount = loan.paidEmis + 1;
            let newBalance = loan.balanceDue - loan.emiAmount;
            let updatedLoan = {
              loan with
              paidEmis = updatedPaymentCount;
              balanceDue = newBalance;
              principalRemaining = newBalance;
            };
            loans.add(loanId, updatedLoan);
          };
          case (#delinquent) {};
        };
      };
    };
  };

  public query ({ caller }) func getLoanStatus(loanId : Text) : async LoanStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loan status");
    };
    switch (loans.get(loanId)) {
      case (null) { Runtime.trap("Loan not found") };
      case (?loan) {
        loan.status;
      };
    };
  };

  public query ({ caller }) func getRemainingEmis(loanId : Text) : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view EMI details");
    };
    switch (loans.get(loanId)) {
      case (null) { Runtime.trap("Loan not found") };
      case (?loan) {
        loan.termMonths - loan.paidEmis;
      };
    };
  };

  public query ({ caller }) func getBalanceDue(loanId : Text) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance details");
    };
    switch (loans.get(loanId)) {
      case (null) { Runtime.trap("Loan not found") };
      case (?loan) {
        loan.balanceDue;
      };
    };
  };

  func calculateEMI(amount : Float, interestRate : Float, termMonths : Int) : Float {
    let monthlyRate = interestRate / (12.0 * 100.0);
    let n = termMonths.toFloat();
    let one = 1.0;

    let numerator = amount * monthlyRate * Float.pow(one + monthlyRate, n);
    let denominator = Float.pow(one + monthlyRate, n) - one;

    numerator / denominator;
  };
};
