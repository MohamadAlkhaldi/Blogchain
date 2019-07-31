pragma solidity ^0.5.0;
import "./contracts/Blogs.sol";


/**
EthPm is quite straight forward, like any common package manager eg. npm. A great to save developers time and to help 
the open source community thrive. 
EthPm is integrated to Truffle:
1- $ truffle install <package name>
2- In you contract file: import "<package name>/<contract name>"
3- That's it you are good to go
 */

/// This file is a demo where I'm extending Blogs.sol

contract SupportOnPlatform is Blogs {
    /// @dev A smart contract to calculate and use the support data on the Blogchain platform

    function allTheSupport()
        public
        view
        returns(uint)
        {
            uint totalValue = 0;
            for (uint i = 0; i<blogs.length; i++) {
                totalValue = totalValue + support[i];
        }
        return(totalValue);
    }
}