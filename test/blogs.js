const Blogs = artifacts.require("../contracts/Blogs.sol");

contract("Blogs", accounts => {
  it("...should store the blog: Hello, test blog.", async () => {
    const blogsInstance = await Blogs.deployed();

    // Create a blog
    let blog_id = await blogsInstance.createBlog.call("Hello, test blog.", { from: accounts[0] });
    blog_id = blog_id.toNumber();

    // Get stored value
    let blog = await blogsInstance.getBlogById.call(blog_id, { from: accounts[0] });
    
    assert.equal(blog, "Hello, test blog.", "The blog content is wrong.");
  });
});
