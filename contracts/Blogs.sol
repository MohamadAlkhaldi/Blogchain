pragma solidity ^0.5.0;

/**
 * @title Blogs
 * @author Mohamad Alkhaldi
 * @dev Simple smart contract which allows any user to issue a bounty in ETH linked to requirements stored in ipfs
 * which anyone can fufill by submitting the ipfs hash which contains evidence of their fufillment
 */
contract Blogs {

  /*
  * Storage
  */

  Blog[] public blogs;
//   Bounty[] public bounties;

  mapping (uint=>uint) public support;

  /*
  * Structs
  */

  struct Blog {
      address payable blogger;
    //   uint deadline;
      string data;
    //   BountyStatus status;
    //   uint amount; //in wei
  }
  
//   struct Bounty {
//       address payable issuer;
//       uint deadline;
//       string data;
//       BountyStatus status;
//       uint amount; //in wei
//   }

//   struct Fulfillment {
//       bool accepted;
//       address payable fulfiller;
//       string data;
//   }

  /**
   * @dev Contructor
   */
  constructor() public {}

  /**
  * @dev issueBounty(): instantiates a new bounty
  * @param _data the requirements of the bounty
  */
  function createBlog(
      string calldata _data
  )
      external
    //   payable
    //   hasValue()
      returns (uint)
  {
      blogs.push(Blog(msg.sender, _data));
      emit BlogCreated(msg.sender, _data);
    //   emit BountyIssued(bounties.length - 1,msg.sender, msg.value, _data);
      return (blogs.length - 1);
  }
  
  function  buyCoffee(
      uint _blogId
      )
      external
      payable
      hasValue()
      notOwner(_blogId)
      returns(bool)
      {
          blogs[_blogId].blogger.transfer(msg.value);
          uint totalSupport = support[_blogId] + msg.value;
          support[_blogId] = totalSupport;
          emit CoffeBought(_blogId, msg.sender, blogs[_blogId].blogger, msg.value);
      }

  /**
  * @dev fulfillBounty(): submit a fulfillment for the given bounty
  * @param _bountyId the index of the bounty to be fufilled
  * @param _data the ipfs hash which contains evidence of the fufillment
  */
//   function fulfillBounty(uint _bountyId, string memory _data)
//     public
//     bountyExists(_bountyId)
//     notIssuer(_bountyId)
//     hasStatus(_bountyId, BountyStatus.CREATED)
//     isBeforeDeadline(_bountyId)
//   {
//     fulfillments[_bountyId].push(Fulfillment(false, msg.sender, _data));
//     emit BountyFulfilled(_bountyId, msg.sender, (fulfillments[_bountyId].length - 1),_data);
//   }

  /**
  * @dev acceptFulfillment(): accept a given fulfillment
  * @param _bountyId the index of the bounty
  * @param _fulfillmentId the index of the fulfillment being accepted
  */
//   function acceptFulfillment(uint _bountyId, uint _fulfillmentId)
//       public
//       bountyExists(_bountyId)
//       fulfillmentExists(_bountyId,_fulfillmentId)
//       onlyIssuer(_bountyId)
//       hasStatus(_bountyId, BountyStatus.CREATED)
//       fulfillmentNotYetAccepted(_bountyId, _fulfillmentId)
//   {
//       fulfillments[_bountyId][_fulfillmentId].accepted = true;
//       bounties[_bountyId].status = BountyStatus.ACCEPTED;
//       fulfillments[_bountyId][_fulfillmentId].fulfiller.transfer(bounties[_bountyId].amount);
//       emit FulfillmentAccepted(_bountyId, bounties[_bountyId].issuer, fulfillments[_bountyId][_fulfillmentId].fulfiller, _fulfillmentId, bounties[_bountyId].amount);
//   }

  /** @dev cancelBounty(): cancels the bounty and send the funds back to the issuer
  * @param _bountyId the index of the bounty
  */
//   function cancelBounty(uint _bountyId)
//       public
//       bountyExists(_bountyId)
//       onlyIssuer(_bountyId)
//       hasStatus(_bountyId, BountyStatus.CREATED)
//   {
//       bounties[_bountyId].status = BountyStatus.CANCELLED;
//       bounties[_bountyId].issuer.transfer(bounties[_bountyId].amount);
//       emit BountyCancelled(_bountyId, msg.sender, bounties[_bountyId].amount);
//   }

  /**
  * Modifiers
  */

  modifier hasValue() {
      require(msg.value > 0);
      _;
  }

//   modifier bountyExists(uint _bountyId){
//     require(_bountyId < bounties.length);
//     _;
//   }

//   modifier fulfillmentExists(uint _bountyId, uint _fulfillmentId){
//     require(_fulfillmentId < fulfillments[_bountyId].length);
//     _;
//   }

//   modifier hasStatus(uint _bountyId, BountyStatus _desiredStatus) {
//     require(bounties[_bountyId].status == _desiredStatus);
//     _;
//   }

//   modifier onlyIssuer(uint _bountyId) {
//       require(msg.sender == bounties[_bountyId].issuer);
//       _;
//   }

  modifier notOwner(uint _blogId) {
      require(msg.sender != blogs[_blogId].blogger);
      _;
  }

//   modifier fulfillmentNotYetAccepted(uint _bountyId, uint _fulfillmentId) {
//     require(fulfillments[_bountyId][_fulfillmentId].accepted == false);
//     _;
//   }

//   modifier validateDeadline(uint _newDeadline) {
//       require(_newDeadline > now);
//       _;
//   }

//   modifier isBeforeDeadline(uint _bountyId) {
//     require(now < bounties[_bountyId].deadline);
//     _;
//   }

  /**
  * Events
  */
  event BlogCreated(address blogger, string data);
//   event BountyIssued(uint bounty_id, address issuer, uint amount, string data);
//   event BountyFulfilled(uint bounty_id, address fulfiller, uint fulfillment_id, string data);
//   event FulfillmentAccepted(uint bounty_id, address issuer, address fulfiller, uint indexed fulfillment_id, uint amount);
  event CoffeBought(uint blog_id, address sender, address receiver, uint amount);
//   event BountyCancelled(uint indexed bounty_id, address indexed issuer, uint amount);

}