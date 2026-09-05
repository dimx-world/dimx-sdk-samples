//
//  ViewController.swift
//  DimxSample - the DimensionX iOS SDK sample
//

import UIKit
import DimxCore

class ViewController: UIViewController {

    // docs:begin urls
    // A public DimensionX experience: the dimension and one of its locations.
    private let arUrl = "https://go.dimx.world/?dim=3382710084&loc=3225571613&live=1&place=1"
    private let webUrl = "https://go.dimx.world/?dim=3382710084"
    // docs:end

    // docs:begin screens
    @IBAction
    func showARScreen() {
        // The SDK asks for what the AR screen needs - the camera is required,
        // location recommended - and shows the screen once granted. onDenied
        // runs when the camera was refused; the web screen is the fallback.
        Context.inst().showARScreen(arUrl, "", "") { [weak self] in
            self?.showWebScreen()
        }
    }

    @IBAction
    func showWebScreen() {
        Context.inst().showWebScreen(webUrl)
    }
    // docs:end
}
