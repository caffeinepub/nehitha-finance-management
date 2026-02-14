import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
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

  let customers = Map.empty<Text, Customer>();
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
};
