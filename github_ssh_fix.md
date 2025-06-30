# GitHub SSH Connection Fix

This document outlines the steps taken to resolve a "Permission denied" error when pushing to a GitHub repository, specifically when using multiple GitHub accounts with different SSH keys.

## Problem
The user encountered a `Permission to inuverse44/homepage.git denied to inuverse8` error when trying to push to `inuverse44/homepage.git`, despite having an SSH key configured for `inuverse44`. The `git remote add origin` command also failed with "remote origin already exists".

## Solution Steps

1.  **Verify Existing Git Remotes**
    Checked the current remote configurations to confirm the `origin` remote was already set up.
    ```bash
    git remote -v
    ```
    *Output confirmed `origin` was set to `git@github.com:inuverse44/homepage.git`.*

2.  **Diagnose SSH Key Usage**
    Used verbose SSH connection to GitHub to identify which SSH key was being used for authentication.
    ```bash
    ssh -vT git@github.com
    ```
    *Output showed authentication as `inuverse8`, indicating the default SSH key (`~/.ssh/id_ed25519`) was being used, which did not have permissions for `inuverse44/homepage.git`.*

3.  **Inspect SSH Configuration**
    Reviewed the `~/.ssh/config` file to understand the SSH key configurations for different GitHub hosts.
    ```bash
    cat ~/.ssh/config
    ```
    *The configuration revealed an alias `github-inuverse44` was correctly set up to use `~/.ssh/id_ed25519_inuverse44`.*

4.  **Update Git Remote URL**
    Modified the `origin` remote's URL to use the `github-inuverse44` alias defined in `~/.ssh/config`. This ensures Git uses the correct SSH key for the `inuverse44/homepage.git` repository.
    ```bash
    git remote set-url origin git@github-inuverse44:inuverse44/homepage.git
    ```

5.  **Push Changes**
    Attempted to push the local `main` branch to the remote `origin` again.
    ```bash
    git push -u origin main
    ```
    *The push was successful, confirming the permission issue was resolved by using the correct SSH key.*
