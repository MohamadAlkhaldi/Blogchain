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

  mapping (uint=>uint) public support;

  /*
  * Structs
  */

  struct Blog {
      address payable blogger;
      string data;
  }

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
  * Modifiers
  */

  modifier hasValue() {
      require(msg.value > 0);
      _;
  }

  modifier notOwner(uint _blogId) {
      require(msg.sender != blogs[_blogId].blogger);
      _;
  }

  /**
  * Events
  */
  event BlogCreated(address blogger, string data);
  event CoffeBought(uint blog_id, address sender, address receiver, uint amount);

}