//
//  RNMonthPicker+Toolbar.m
//  CocoaAsyncSocket
//
//  Created by Gustavo Paris on 22/09/2020.
//
#import "RNMonthPicker+Toolbar.h"
#import "RNMonthPicker.h"

@implementation RNMonthPickerToolbar

UIBarButtonItem *cancelButton;
UIBarButtonItem *doneButton;
RNMonthPicker *picker;

- (instancetype)initWithFrame:(CGRect)frame {
    CGRect screen = [[UIScreen mainScreen] bounds];
    if ((self = [super initWithFrame:frame])) {
        cancelButton = [[UIBarButtonItem alloc] initWithTitle:@"Cancel" style:UIAlertActionStyleCancel target:self action:@selector(onCancelButton)];
        doneButton = [[UIBarButtonItem alloc] initWithTitle:@"Done" style:UIBarButtonItemStyleDone target:self action:@selector(onDoneButton)];
        picker = [RNMonthPicker new];
        picker.frame = CGRectMake(0, 0, CGRectGetWidth(screen) - 20, 221);
        UIColor* defaultColor;
        if (@available(iOS 13.0, *)) {
            defaultColor = [UIColor tertiarySystemBackgroundColor];
        } else {
            defaultColor = [UIColor whiteColor];
        }
        [self setValue:defaultColor forKey:@"backgroundColor"];
        [self addSubview:picker];
    }
    return self;
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps {
    UIBarButtonItem *flexibleSpace = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace target:nil action:nil];
    if (_neutralButtonLabel) {
        UIBarButtonItem *neutralButton = [[UIBarButtonItem alloc] initWithTitle:_neutralButtonLabel style:UIBarButtonItemStylePlain target:self action:@selector(onNeutralButton)];
    } else {
    }
}

- (void)onCancelButton {
    _onCancel(@{});
}

- (void)onDoneButton {
    _onDone(@{});
}

- (void)onNeutralButton {
    _onNeutral(@{});
}

- (void)setAutoTheme:(BOOL)enableAutoTheme {
    if (@available(iOS 13.0, *)) {
        if (!enableAutoTheme) {
            self.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
        }
    }
}

- (void)setValue:(NSDate *)value {
    [picker setValue:value];
}

- (void)setMaximumDate:(NSDate *)maximumDate {
    [picker setMaximumDate:maximumDate];
}

- (void)setMinimumDate:(NSDate *)minimumDate {
    [picker setMinimumDate:minimumDate];
}

- (void)setOnChange:(RCTBubblingEventBlock)onChange {
    [picker setOnChange:onChange];
}

- (void)setLocale:(NSLocale *)locale {
    [picker setLocale:locale];
}

- (void)setMode:(NSString *)mode {
    [picker setMode:mode];
}

- (void)setOkButtonLabel:(NSString *)okButtonLabel {
    doneButton.title = okButtonLabel;
}

- (void)setCancelButtonLabel:(NSString *)cancelButtonLabel {
    cancelButton.title = cancelButtonLabel;
}

@end
