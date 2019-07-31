pragma solidity ^0.5.0;

/**
 * @title Blogchain
 * @author Mohamad Alkhaldi
 */
contract Blogs {
/// @dev A smart contract which allows bloggers to post blogs on the chain and recieve support from readers, in ether

  /*
  * Storage
  */

  Blog[] public blogs;

  /// @dev mapping between blog Id and the amount of support it's generated
  mapping (uint=>uint) public support;

  /*
  * Structs
  */

  struct Blog {
      address payable blogger;
      string data;
  }

  /**
  * @dev createBlog(): creates a blog
  * @param _data the contents of the blog, in our case it will be an IPFS reference to the blog content
  */
  function createBlog(
      string calldata _data
  )
      external
      returns (uint)
  {
      blogs.push(Blog(msg.sender, _data));
      emit BlogCreated(blogs.length - 1, msg.sender, _data);
      return (blogs.length - 1);
  }
  
  /**
  * @dev getBlogById(): get blog by id, only used in testing
  * @param _blogId blog id (index) in the blogs array
  */
  function getBlogById(
      uint _blogId
  )
      external
      view
      returns (string memory)
  {
      string storage content = blogs[_blogId].data;
      return (content);
  }
  
  /**
  * @dev buyCoffee(): Sends ether to blog's writer
  * @param _blogId the blog which the reader want support
  */
  function  buyCoffee(
      uint _blogId
      )
      external
      payable
      hasValue()
      notOwner(_blogId)
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
  event BlogCreated(uint blog_id, address blogger, string data);
  event CoffeBought(uint blog_id, address sender, address receiver, uint amount);

}